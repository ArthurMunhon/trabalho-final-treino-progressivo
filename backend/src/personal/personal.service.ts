import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';

// Quanto maior, mais difícil de quebrar a senha (e mais lento). 10 é o padrão.
const RODADAS_HASH = 10;

const SEM_SENHA = { senha: true } as const;

@Injectable()
export class PersonalService {
  constructor(private readonly prisma: PrismaService) {}

  // Usado pelo login: precisa da senha (hash) para comparar
  buscarPorEmailComSenha(email: string) {
    return this.prisma.personal.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findOne(id: string) {
    const personal = await this.prisma.personal.findUnique({
      where: { id },
      omit: SEM_SENHA,
    });
    if (!personal) {
      throw new NotFoundException(`Personal ${id} nao encontrado`);
    }
    return personal;
  }

  async create(dto: RegisterDto) {
    const email = dto.email.toLowerCase();

    // E-mail é único no sistema todo (contrato, 3.3), não só entre personais
    const [personal, aluno] = await Promise.all([
      this.prisma.personal.findUnique({ where: { email } }),
      this.prisma.aluno.findUnique({ where: { email } }),
    ]);
    if (personal || aluno) {
      throw new ConflictException('Ja existe usuario com esse e-mail');
    }

    // A senha nunca é salva em texto puro: só o hash vai pro banco
    return this.prisma.personal.create({
      data: {
        nome: dto.nome,
        email,
        senha: await hash(dto.senha, RODADAS_HASH),
      },
      omit: SEM_SENHA,
    });
  }
}
