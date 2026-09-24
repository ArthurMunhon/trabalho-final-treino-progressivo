import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SituacaoSessao } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSessaoTreinoDto } from './dto/create-sessao-treino.dto.js';
import { CreateSerieExecutadaDto } from './dto/create-serie-executada.dto.js';
import { QuerySessaoTreinoDto } from './dto/query-sessao-treino.dto.js';

const COM_FICHA_ITENS = { ficha: { include: { itens: true } } } as const;

function round2(valor: number) {
  return Math.round(valor * 100) / 100;
}

function serieParaDto(serie: {
  id: string;
  sessao_treinoId: string;
  itemFichaId: string;
  numero_Serie: number;
  cargaUsada: number;
  repeticoesFeitas: number;
}) {
  return {
    id: serie.id,
    sessaoTreinoId: serie.sessao_treinoId,
    itemFichaId: serie.itemFichaId,
    numeroSerie: serie.numero_Serie,
    cargaUsada: serie.cargaUsada,
    repeticoesFeitas: serie.repeticoesFeitas,
  };
}

function sessaoParaDto(sessao: {
  id: string;
  alunoId: string;
  fichaId: string;
  data: Date;
  situacao: SituacaoSessao;
  serie_executada: Parameters<typeof serieParaDto>[0][];
}) {
  return {
    id: sessao.id,
    alunoId: sessao.alunoId,
    fichaId: sessao.fichaId,
    data: sessao.data,
    situacao: sessao.situacao,
    seriesExecutadas: sessao.serie_executada.map(serieParaDto),
  };
}

@Injectable()
export class SessoesTreinoService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QuerySessaoTreinoDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where = {
      ...(query.alunoId && { alunoId: query.alunoId }),
      ...(query.fichaId && { fichaId: query.fichaId }),
    };

    const [sessoes, total] = await Promise.all([
      this.prisma.sessao_Treino.findMany({
        where,
        include: { serie_executada: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.sessao_Treino.count({ where }),
    ]);

    return { dados: sessoes.map(sessaoParaDto), total, page, limit };
  }

  async findOne(id: string) {
    const sessao = await this.prisma.sessao_Treino.findUnique({
      where: { id },
      include: { serie_executada: true },
    });
    if (!sessao) {
      throw new NotFoundException(`Sessao de treino ${id} nao encontrada`);
    }
    return sessaoParaDto(sessao);
  }

  async create(dto: CreateSessaoTreinoDto) {
    const ficha = await this.prisma.ficha.findUnique({
      where: { id: dto.fichaId },
      select: { id: true, alunoId: true },
    });
    if (!ficha) {
      throw new NotFoundException(`Ficha ${dto.fichaId} nao encontrada`);
    }
    if (ficha.alunoId !== dto.alunoId) {
      throw new BadRequestException('fichaId nao pertence ao alunoId informado');
    }

    const emAndamento = await this.prisma.sessao_Treino.count({
      where: { fichaId: dto.fichaId, situacao: SituacaoSessao.em_andamento },
    });
    if (emAndamento > 0) {
      throw new ConflictException(
        'Ja existe uma sessao em_andamento para essa ficha',
      );
    }

    const sessao = await this.prisma.sessao_Treino.create({
      data: { alunoId: dto.alunoId, fichaId: dto.fichaId, data: new Date() },
      include: { serie_executada: true },
    });

    return sessaoParaDto(sessao);
  }

  async registrarSerie(sessaoId: string, dto: CreateSerieExecutadaDto) {
    const sessao = await this.prisma.sessao_Treino.findUnique({
      where: { id: sessaoId },
      include: COM_FICHA_ITENS,
    });
    if (!sessao) {
      throw new NotFoundException(`Sessao de treino ${sessaoId} nao encontrada`);
    }
    if (sessao.situacao === SituacaoSessao.finalizada) {
      throw new ConflictException('Sessao ja esta finalizada');
    }

    const itemPertenceAFicha = sessao.ficha.itens.some(
      (item) => item.id === dto.itemFichaId,
    );
    if (!itemPertenceAFicha) {
      const item = await this.prisma.item_Ficha.findUnique({
        where: { id: dto.itemFichaId },
        select: { id: true },
      });
      if (!item) {
        throw new NotFoundException(
          `Item de ficha ${dto.itemFichaId} nao encontrado`,
        );
      }
      throw new ConflictException(
        'itemFichaId nao pertence a ficha da sessao',
      );
    }

    const serie = await this.prisma.serie_Executada.create({
      data: {
        sessao_treinoId: sessaoId,
        itemFichaId: dto.itemFichaId,
        numero_Serie: dto.numeroSerie,
        cargaUsada: dto.cargaUsada,
        repeticoesFeitas: dto.repeticoesFeitas,
      },
    });

    return serieParaDto(serie);
  }

  async finalizar(sessaoId: string) {
    const sessao = await this.prisma.sessao_Treino.findUnique({
      where: { id: sessaoId },
      include: { serie_executada: true, ...COM_FICHA_ITENS },
    });
    if (!sessao) {
      throw new NotFoundException(`Sessao de treino ${sessaoId} nao encontrada`);
    }
    if (sessao.situacao === SituacaoSessao.finalizada) {
      throw new ConflictException('Sessao ja esta finalizada');
    }
    if (sessao.serie_executada.length === 0) {
      throw new ConflictException('Sessao nao tem nenhuma serie registrada');
    }

    const seriesPorItem = new Map<string, typeof sessao.serie_executada>();
    for (const serie of sessao.serie_executada) {
      const lista = seriesPorItem.get(serie.itemFichaId) ?? [];
      lista.push(serie);
      seriesPorItem.set(serie.itemFichaId, lista);
    }

    const itensAtualizados: {
      itemFichaId: string;
      cargaAnterior: number;
      cargaSugeridaNova: number;
    }[] = [];

    for (const [itemFichaId, series] of seriesPorItem) {
      const item = sessao.ficha.itens.find((i) => i.id === itemFichaId);
      if (!item) continue;

      const metaCumprida = series.filter(
        (s) => s.repeticoesFeitas >= item.repeticoesAlvo,
      ).length;
      const abaixoDaMeta = series.length - metaCumprida;
      const ultimaSerie = series.reduce((a, b) =>
        a.numero_Serie > b.numero_Serie ? a : b,
      );

      let cargaSugeridaNova: number;
      if (metaCumprida === series.length) {
        cargaSugeridaNova = round2(ultimaSerie.cargaUsada * 1.05);
      } else if (abaixoDaMeta > 1) {
        cargaSugeridaNova = round2(ultimaSerie.cargaUsada * 0.95);
      } else {
        cargaSugeridaNova = item.cargaSugerida;
      }

      itensAtualizados.push({
        itemFichaId,
        cargaAnterior: item.cargaSugerida,
        cargaSugeridaNova,
      });
    }

    await this.prisma.$transaction([
      ...itensAtualizados
        .filter((i) => i.cargaSugeridaNova !== i.cargaAnterior)
        .map((i) =>
          this.prisma.item_Ficha.update({
            where: { id: i.itemFichaId },
            data: { cargaSugerida: i.cargaSugeridaNova },
          }),
        ),
      this.prisma.sessao_Treino.update({
        where: { id: sessaoId },
        data: { situacao: SituacaoSessao.finalizada },
      }),
    ]);

    return { id: sessaoId, situacao: SituacaoSessao.finalizada, itensAtualizados };
  }
}
