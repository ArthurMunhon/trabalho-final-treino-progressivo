import { IsInt, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateItemFichaDto {
  @IsUUID()
  exercicioId: string;

  @IsInt()
  @Min(1)
  ordem: number;

  @IsInt()
  @Min(1)
  seriesAlvo: number;

  @IsInt()
  @Min(1)
  repeticoesAlvo: number;

  @IsNumber()
  @Min(0)
  cargaSugerida: number;
}
