import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { CreateItemFichaDto } from './create-item-ficha.dto.js';

export class CreateFichaDto {
  @IsUUID()
  alunoId: string;

  // Temporario ate o AuthModule existir: depois passa a vir do token, nao do corpo da requisicao.
  @IsUUID()
  personalId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemFichaDto)
  itens?: CreateItemFichaDto[];
}
