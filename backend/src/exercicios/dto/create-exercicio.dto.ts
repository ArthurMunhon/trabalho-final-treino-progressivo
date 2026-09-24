import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateExercicioDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 120)
  nome: string;

  @IsString()
  @IsNotEmpty()
  grupoMuscular: string;
}
