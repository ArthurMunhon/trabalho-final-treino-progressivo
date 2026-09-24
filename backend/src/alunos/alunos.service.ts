import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAlunoDto } from './dto/create-aluno.dto.js';
import { UpdateAlunoDto } from './dto/update-aluno.dto.js';
import { QueryAlunoDto } from './dto/query-aluno.dto.js';

const SEM_SENHA = { senha: true } as const;

@Injectable()
export class AlunosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryAlunoDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where = query.busca
      ? {
          OR: [
            { nome: { contains: query.busca, mode: 'insensitive' as const } },
            { email: { contains: query.busca, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [dados, total] = await Promise.all([
      this.prisma.aluno.findMany({
        where,
        omit: SEM_SENHA,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.aluno.count({ where }),
    ]);

    return { dados, total, page, limit };
  }

  async findOne(id: string) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id },
      omit: SEM_SENHA,
    });
    if (!aluno) {
      throw new NotFoundException(`Aluno ${id} nao encontrado`);
    }
    return aluno;
  }

  async create(dto: CreateAlunoDto) {
    try {
      return await this.prisma.aluno.create({ data: dto, omit: SEM_SENHA });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Ja existe usuario com esse e-mail');
      }
      throw e;
    }
  }

  async update(id: string, dto: UpdateAlunoDto) {
    await this.findOne(id);
    try {
      return await this.prisma.aluno.update({
        where: { id },
        data: dto,
        omit: SEM_SENHA,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Ja existe usuario com esse e-mail');
      }
      throw e;
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    const fichas = await this.prisma.ficha.count({ where: { alunoId: id } });
    if (fichas > 0) {
      throw new ConflictException(
        'Aluno tem ficha cadastrada - historico nao pode ser perdido',
      );
    }

    await this.prisma.aluno.delete({ where: { id } });
  }
}
