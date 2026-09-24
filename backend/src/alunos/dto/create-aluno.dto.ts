import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAlunoDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 120)
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  senha: string;
}
