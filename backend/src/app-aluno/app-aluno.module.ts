import { Module } from '@nestjs/common';
import { AppAlunoController } from './app-aluno.controller.js';
import { AppAlunoService } from './app-aluno.service.js';

@Module({
  controllers: [AppAlunoController],
  providers: [AppAlunoService],
})
export class AppAlunoModule {}
