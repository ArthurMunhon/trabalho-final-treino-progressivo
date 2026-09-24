import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SessoesTreinoService } from './sessoes-treino.service.js';
import { CreateSessaoTreinoDto } from './dto/create-sessao-treino.dto.js';
import { CreateSerieExecutadaDto } from './dto/create-serie-executada.dto.js';
import { QuerySessaoTreinoDto } from './dto/query-sessao-treino.dto.js';

@Controller('sessoes-treino')
export class SessoesTreinoController {
  constructor(private readonly sessoesTreinoService: SessoesTreinoService) {}

  @Get()
  findAll(@Query() query: QuerySessaoTreinoDto) {
    return this.sessoesTreinoService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessoesTreinoService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSessaoTreinoDto) {
    return this.sessoesTreinoService.create(dto);
  }

  @Post(':id/series')
  registrarSerie(
    @Param('id') id: string,
    @Body() dto: CreateSerieExecutadaDto,
  ) {
    return this.sessoesTreinoService.registrarSerie(id, dto);
  }

  @Post(':id/finalizar')
  finalizar(@Param('id') id: string) {
    return this.sessoesTreinoService.finalizar(id);
  }
}
