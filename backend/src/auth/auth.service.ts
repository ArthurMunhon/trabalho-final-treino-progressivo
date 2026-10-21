import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { PersonalService } from '../personal/personal.service.js';
import { RegisterDto } from '../personal/dto/register.dto.js';
import { assinarToken, type Perfil } from './jwt.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly personalService: PersonalService,
  ) {}

  // Auto-cadastro de personal (contrato 1.2). Já devolve logado.
  async register(dto: RegisterDto) {
    const personal = await this.personalService.create(dto);
    return this.montarResposta(personal, 'personal');
  }

  // Mesmo login para os dois perfis: procura primeiro em Personal, depois em Aluno
  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase();

    const personal = await this.personalService.buscarPorEmailComSenha(email);
    const usuario =
      personal ?? (await this.prisma.aluno.findUnique({ where: { email } }));
    const perfil: Perfil = personal ? 'personal' : 'aluno';

    // Mesma mensagem para "e-mail não existe" e "senha errada",
    // para não revelar quais e-mails estão cadastrados.
    const senhaCorreta =
      usuario !== null && (await compare(dto.senha, usuario.senha));
    if (!usuario || !senhaCorreta) {
      throw new UnauthorizedException('E-mail ou senha invalidos');
    }

    return this.montarResposta(usuario, perfil);
  }

  // Formato da resposta: contrato, seção 2.2
  private async montarResposta(
    usuario: { id: string; nome: string },
    perfil: Perfil,
  ) {
    const accessToken = await assinarToken({ sub: usuario.id, perfil });
    return {
      accessToken,
      usuario: { id: usuario.id, nome: usuario.nome, perfil },
    };
  }
}
