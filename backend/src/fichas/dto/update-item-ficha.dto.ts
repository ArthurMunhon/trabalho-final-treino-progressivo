import { PartialType } from '@nestjs/mapped-types';
import { CreateItemFichaDto } from './create-item-ficha.dto.js';

export class UpdateItemFichaDto extends PartialType(CreateItemFichaDto) {}
