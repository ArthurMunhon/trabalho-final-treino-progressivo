import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// Corpo de POST /aluno-auth/register (cadastro pelo app)
export class RegisterAlunoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(72) // limite do bcrypt: passa de 72 bytes ele ignora o resto
  senha: string;
}
