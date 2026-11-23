import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SolicitacoesService {
  constructor(private readonly prisma: PrismaService) {}

  // Pedidos pendentes DESTE personal, os mais recentes primeiro
  listar(personalId: string) {
    return this.prisma.solicitacao.findMany({
      where: { personalId },
      orderBy: { createdAt: 'desc' },
      include: { aluno: { select: { id: true, nome: true, email: true } } },
    });
  }

  async aceitar(id: string, personalId: string) {
    // findFirst com personalId: um personal não mexe no pedido de outro
    const pedido = await this.prisma.solicitacao.findFirst({
      where: { id, personalId },
    });
    if (!pedido) throw new NotFoundException('Solicitação não encontrada');

    // Transação: ou faz as duas coisas, ou nenhuma
    await this.prisma.$transaction([
      // 1) o aluno passa a ser deste personal
      this.prisma.aluno.update({
        where: { id: pedido.alunoId },
        data: { personalId },
      }),
      // 2) apaga o pedido (e qualquer outro pedido do mesmo aluno para outros personals)
      this.prisma.solicitacao.deleteMany({
        where: { alunoId: pedido.alunoId },
      }),
    ]);
  }

  async recusar(id: string, personalId: string) {
    const { count } = await this.prisma.solicitacao.deleteMany({
      where: { id, personalId },
    });
    if (count === 0) throw new NotFoundException('Solicitação não encontrada');
  }
}
