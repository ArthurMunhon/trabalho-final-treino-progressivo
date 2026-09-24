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
import { FichasService } from './fichas.service.js';
import { CreateFichaDto } from './dto/create-ficha.dto.js';
import { UpdateFichaDto } from './dto/update-ficha.dto.js';
import { QueryFichaDto } from './dto/query-ficha.dto.js';
import { CreateItemFichaDto } from './dto/create-item-ficha.dto.js';

@Controller('fichas')
export class FichasController {
  constructor(private readonly fichasService: FichasService) {}

  @Get()
  findAll(@Query() query: QueryFichaDto) {
    return this.fichasService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fichasService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateFichaDto) {
    return this.fichasService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFichaDto) {
    return this.fichasService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.fichasService.remove(id);
  }

  @Post(':fichaId/itens')
  addItem(
    @Param('fichaId') fichaId: string,
    @Body() dto: CreateItemFichaDto,
  ) {
    return this.fichasService.addItem(fichaId, dto);
  }
}
