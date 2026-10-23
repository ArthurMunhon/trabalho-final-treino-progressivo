import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { assinarToken } from '../auth/jwt.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

// Quanto maior, mais difícil de quebrar a senha (e mais lento). 10 é o padrão.
const RODADAS_HASH = 10;

@Injectable()
export class PersonalService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();

    const existente = await this.prisma.personal.findUnique({
      where: { email },
    });
    if (existente) {
      throw new ConflictException('Ja existe usuario com esse e-mail');
    }

    // A senha nunca é salva em texto puro: só o hash vai pro banco
    const personal = await this.prisma.personal.create({
      data: {
        nome: dto.nome,
        email: email,
        senha: await hash(dto.senha, RODADAS_HASH),
      },
    });

    return this.montarResposta(personal);
  }

  async login(dto: LoginDto) {
    const personal = await this.prisma.personal.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    // Mesma mensagem para "e-mail não existe" e "senha errada",
    // para não revelar quais e-mails estão cadastrados.
    const senhaCorreta =
      personal !== null && (await compare(dto.senha, personal.senha));
    if (!personal || !senhaCorreta) {
      throw new UnauthorizedException('E-mail ou senha invalidos');
    }

    return this.montarResposta(personal);
  }

  private async montarResposta(personal: {
    id: string;
    nome: string;
    email: string;
  }) {
    const accessToken = await assinarToken({
      sub: personal.id,
      email: personal.email,
    });
    return {
      accessToken,
      personal: { id: personal.id, nome: personal.nome, email: personal.email },
    };
  }
}
