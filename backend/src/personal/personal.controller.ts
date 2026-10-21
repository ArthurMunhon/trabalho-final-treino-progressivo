import { Controller, Get, UseGuards } from '@nestjs/common';
import { PersonalService } from './personal.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import {
  Perfis,
  UsuarioLogado,
  type UsuarioDoToken,
} from '../auth/usuario-logado.decorator.js';

@Controller('personal')
@UseGuards(JwtAuthGuard)
@Perfis('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  // GET /personal/me  ->  dados do personal logado (cabeçalho do web)
  @Get('me')
  me(@UsuarioLogado() usuario: UsuarioDoToken) {
    return this.personalService.findOne(usuario.id);
  }
}
