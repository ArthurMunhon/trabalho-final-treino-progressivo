import { IsOptional, IsUUID } from 'class-validator';

export class UpdateFichaDto {
  @IsOptional()
  @IsUUID()
  alunoId?: string;
}
