import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateItemFichaDto {
  // Exercício do catálogo OU nomePersonalizado (a regra "um dos dois" fica no service)
  @IsOptional()
  @IsUUID()
  exercicioId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  nomePersonalizado?: string;

  @IsIn(['forca', 'cardio'])
  tipo: 'forca' | 'cardio';

  @IsInt()
  @Min(1)
  ordem: number;

  // Força
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  seriesAlvo?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  repeticoesAlvo?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000)
  cargaSugerida?: number;

  // Cardio
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(300)
  duracaoMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(40)
  velocidadeKmh?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(40)
  inclinacaoPct?: number;
}
