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
import { ExerciciosService } from './exercicios.service.js';
import { CreateExercicioDto } from './dto/create-exercicio.dto.js';
import { UpdateExercicioDto } from './dto/update-exercicio.dto.js';
import { QueryExercicioDto } from './dto/query-exercicio.dto.js';

@Controller('exercicios')
export class ExerciciosController {
  constructor(private readonly exerciciosService: ExerciciosService) {}

  @Get()
  findAll(@Query() query: QueryExercicioDto) {
    return this.exerciciosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exerciciosService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateExercicioDto) {
    return this.exerciciosService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateExercicioDto) {
    return this.exerciciosService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.exerciciosService.remove(id);
  }
}
