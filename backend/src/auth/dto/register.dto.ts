import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

// Cadastro de personal trainer (quem usa o site).
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 120)
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;
}
