import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import AlunosService from './alunos.service.js';
import { CreateAlunoDto } from './dto/create-aluno.dto.js';
import { UpdateAlunoDto } from './dto/update-aluno.dto.js';
import { QueryAlunoDto } from './dto/query-aluno.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PersonalLogado } from '../personal/personal-logado.decorator.js';
import type { PersonalDoToken } from '../personal/personal-logado.decorator.js';

@UseGuards(JwtAuthGuard) // vale para TODAS as rotas deste controller
@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @Get()
  findAll(
    @Query() query: QueryAlunoDto,
    @PersonalLogado() personal: PersonalDoToken,
  ) {
    return this.alunosService.findAll(query, personal.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @PersonalLogado() personal: PersonalDoToken,
  ) {
    return this.alunosService.findOne(id, personal.id);
  }

  @Post()
  create(
    @Body() dto: CreateAlunoDto,
    @PersonalLogado() personal: PersonalDoToken,
  ) {
    return this.alunosService.create(dto, personal.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAlunoDto,
    @PersonalLogado() personal: PersonalDoToken,
  ) {
    return this.alunosService.update(id, dto, personal.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @PersonalLogado() personal: PersonalDoToken) {
    return this.alunosService.remove(id, personal.id);
  }
}
