import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AppAlunoService {
  constructor(private readonly prisma: PrismaService) {}

  async login(email: string) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { email },
      select: { id: true, nome: true, email: true, personalId: true },
    });

    if (!aluno) throw new NotFoundException('Aluno não encontrado');
    return aluno;
  }
}
