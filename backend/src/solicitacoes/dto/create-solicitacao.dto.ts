import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

// Corpo de POST /solicitacoes (o aluno pede para ser atendido por um personal).
// O alunoId NÃO vem aqui: o back-end pega do token do aluno logado.
export class CreateSolicitacaoDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail()
  emailPersonal: string;
}
