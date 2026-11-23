import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AppAlunoService } from './app-aluno.service.js';
import { LoginAppDto } from './dto/login-app.dto.js';

@Controller('app')
export class AppAlunoController {
  constructor(private readonly service: AppAlunoService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginAppDto) {
    return this.service.login(dto.email);
  }
}
