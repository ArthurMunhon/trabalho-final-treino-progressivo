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
import { PersonalLogado } from '../auth/personal-logado.decorator.js';

@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @Get()
  findAll(@Query() query: QueryAlunoDto) {
    return this.alunosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alunosService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard) // Protege para exigir que o personal esteja logado
  create(
    @Body() dto: CreateAlunoDto,
    @PersonalLogado() personal: { id: string }, // Pega o ID do personal direto do token JWT
  ) {
    return this.alunosService.create(dto, personal.id); // Envia o ID para o service salvar o vínculo
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAlunoDto) {
    return this.alunosService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.alunosService.remove(id);
  }
}
