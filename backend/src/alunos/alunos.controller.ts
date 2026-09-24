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
} from '@nestjs/common';
import { AlunosService } from './alunos.service.js';
import { CreateAlunoDto } from './dto/create-aluno.dto.js';
import { UpdateAlunoDto } from './dto/update-aluno.dto.js';
import { QueryAlunoDto } from './dto/query-aluno.dto.js';

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
  create(@Body() dto: CreateAlunoDto) {
    return this.alunosService.create(dto);
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
