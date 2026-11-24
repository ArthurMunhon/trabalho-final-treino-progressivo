import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

// Corpo de POST /app/login (login falso do app: só o e-mail, sem senha)
export class LoginAppDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  email: string;
}
