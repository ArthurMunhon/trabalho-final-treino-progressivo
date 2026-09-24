import { IsUUID } from 'class-validator';

export class CreateSessaoTreinoDto {
  @IsUUID()
  fichaId: string;

  // Temporario ate o AuthModule existir: depois vem do token, nao do corpo da requisicao.
  @IsUUID()
  alunoId: string;
}
