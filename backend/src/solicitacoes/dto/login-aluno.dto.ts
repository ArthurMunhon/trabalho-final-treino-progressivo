import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

// Corpo de POST /aluno-auth/login
export class LoginAlunoDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail()
  email: string;

  @IsString()
  senha: string;
}
