import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateExercicioDto } from './dto/create-exercicio.dto.js';
import { UpdateExercicioDto } from './dto/update-exercicio.dto.js';
import { QueryExercicioDto } from './dto/query-exercicio.dto.js';

@Injectable()
export class ExerciciosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryExercicioDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where = query.grupoMuscular
      ? { grupoMuscular: query.grupoMuscular }
      : {};

    const [dados, total] = await Promise.all([
      this.prisma.exercicio.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.exercicio.count({ where }),
    ]);

    return { dados, total, page, limit };
  }

  async findOne(id: string) {
    const exercicio = await this.prisma.exercicio.findUnique({
      where: { id },
    });
    if (!exercicio) {
      throw new NotFoundException(`Exercicio ${id} nao encontrado`);
    }
    return exercicio;
  }

  create(dto: CreateExercicioDto) {
    return this.prisma.exercicio.create({ data: dto });
  }

  async update(id: string, dto: UpdateExercicioDto) {
    await this.findOne(id);
    return this.prisma.exercicio.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);

    const emUso = await this.prisma.item_Ficha.count({
      where: { exercicioId: id },
    });
    if (emUso > 0) {
      throw new ConflictException(
        'Exercicio esta em uso em algum item de ficha',
      );
    }

    await this.prisma.exercicio.delete({ where: { id } });
  }
}
