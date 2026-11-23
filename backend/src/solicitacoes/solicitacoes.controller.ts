import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PersonalLogado } from '../personal/personal-logado.decorator.js';
import { SolicitacoesService } from './solicitacoes.service.js';

// @PersonalLogado() devolve { id, email } do token: usamos só o id
type PersonalDoToken = { id: string; email: string };

@UseGuards(JwtAuthGuard)
@Controller('solicitacoes')
export class SolicitacoesController {
  constructor(private readonly service: SolicitacoesService) {}

  @Get()
  listar(@PersonalLogado() personal: PersonalDoToken) {
    return this.service.listar(personal.id);
  }

  @Post(':id/aceitar')
  @HttpCode(HttpStatus.NO_CONTENT)
  aceitar(
    @Param('id', ParseUUIDPipe) id: string,
    @PersonalLogado() personal: PersonalDoToken,
  ) {
    return this.service.aceitar(id, personal.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  recusar(
    @Param('id', ParseUUIDPipe) id: string,
    @PersonalLogado() personal: PersonalDoToken,
  ) {
    return this.service.recusar(id, personal.id);
  }
}
