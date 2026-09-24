import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFichaDto } from './dto/create-ficha.dto.js';
import { UpdateFichaDto } from './dto/update-ficha.dto.js';
import { QueryFichaDto } from './dto/query-ficha.dto.js';
import { CreateItemFichaDto } from './dto/create-item-ficha.dto.js';
import { UpdateItemFichaDto } from './dto/update-item-ficha.dto.js';

const COM_ITENS = { itens: { include: { exercicio: true } } } as const;

@Injectable()
export class FichasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryFichaDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where = query.alunoId ? { alunoId: query.alunoId } : {};

    const [dados, total] = await Promise.all([
      this.prisma.ficha.findMany({
        where,
        include: COM_ITENS,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.ficha.count({ where }),
    ]);

    return { dados, total, page, limit };
  }

  async findOne(id: string) {
    const ficha = await this.prisma.ficha.findUnique({
      where: { id },
      include: COM_ITENS,
    });
    if (!ficha) {
      throw new NotFoundException(`Ficha ${id} nao encontrada`);
    }
    return ficha;
  }

  private async ensureExists(id: string) {
    const ficha = await this.prisma.ficha.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!ficha) {
      throw new NotFoundException(`Ficha ${id} nao encontrada`);
    }
  }

  async create(dto: CreateFichaDto) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id: dto.alunoId },
      select: { id: true },
    });
    if (!aluno) {
      throw new BadRequestException('alunoId inexistente');
    }

    const personal = await this.prisma.personal.findUnique({
      where: { id: dto.personalId },
      select: { id: true },
    });
    if (!personal) {
      throw new BadRequestException('personalId inexistente');
    }

    if (dto.itens?.length) {
      const exercicioIds = [...new Set(dto.itens.map((i) => i.exercicioId))];
      const count = await this.prisma.exercicio.count({
        where: { id: { in: exercicioIds } },
      });
      if (count !== exercicioIds.length) {
        throw new BadRequestException('exercicioId inexistente em algum item');
      }
    }

    return this.prisma.ficha.create({
      data: {
        alunoId: dto.alunoId,
        personalId: dto.personalId,
        itens: dto.itens?.length ? { create: dto.itens } : undefined,
      },
      include: COM_ITENS,
    });
  }

  async update(id: string, dto: UpdateFichaDto) {
    await this.ensureExists(id);

    if (dto.alunoId) {
      const aluno = await this.prisma.aluno.findUnique({
        where: { id: dto.alunoId },
        select: { id: true },
      });
      if (!aluno) {
        throw new BadRequestException('alunoId inexistente');
      }
    }

    return this.prisma.ficha.update({
      where: { id },
      data: dto,
      include: COM_ITENS,
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);

    const sessoes = await this.prisma.sessao_Treino.count({
      where: { fichaId: id },
    });
    if (sessoes > 0) {
      throw new ConflictException(
        'Ficha tem sessao de treino registrada - historico nao pode ser perdido',
      );
    }

    await this.prisma.ficha.delete({ where: { id } });
  }

  async addItem(fichaId: string, dto: CreateItemFichaDto) {
    const ficha = await this.prisma.ficha.findUnique({
      where: { id: fichaId },
      select: { id: true },
    });
    if (!ficha) {
      throw new NotFoundException(`Ficha ${fichaId} nao encontrada`);
    }

    const exercicio = await this.prisma.exercicio.findUnique({
      where: { id: dto.exercicioId },
      select: { id: true },
    });
    if (!exercicio) {
      throw new NotFoundException(`Exercicio ${dto.exercicioId} nao encontrado`);
    }

    return this.prisma.item_Ficha.create({
      data: { fichaId, ...dto },
      include: { exercicio: true },
    });
  }

  async updateItem(id: string, dto: UpdateItemFichaDto) {
    const item = await this.prisma.item_Ficha.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item de ficha ${id} nao encontrado`);
    }

    return this.prisma.item_Ficha.update({
      where: { id },
      data: dto,
      include: { exercicio: true },
    });
  }

  async removeItem(id: string) {
    const item = await this.prisma.item_Ficha.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!item) {
      throw new NotFoundException(`Item de ficha ${id} nao encontrado`);
    }

    const emUso = await this.prisma.serie_Executada.count({
      where: { itemFichaId: id },
    });
    if (emUso > 0) {
      throw new ConflictException(
        'Item ja tem serie executada registrada em alguma sessao',
      );
    }

    await this.prisma.item_Ficha.delete({ where: { id } });
  }
}
