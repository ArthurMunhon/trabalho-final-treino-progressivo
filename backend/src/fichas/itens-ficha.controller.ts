import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { FichasService } from './fichas.service.js';
import { UpdateItemFichaDto } from './dto/update-item-ficha.dto.js';

@Controller('itens-ficha')
export class ItensFichaController {
  constructor(private readonly fichasService: FichasService) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateItemFichaDto) {
    return this.fichasService.updateItem(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.fichasService.removeItem(id);
  }
}
