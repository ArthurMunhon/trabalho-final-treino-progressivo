import { IsInt, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateSerieExecutadaDto {
  @IsUUID()
  itemFichaId: string;

  @IsInt()
  @Min(1)
  numeroSerie: number;

  @IsNumber()
  @Min(0)
  cargaUsada: number;

  @IsInt()
  @Min(0)
  repeticoesFeitas: number;
}
