import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ExerciciosModule } from './exercicios/exercicios.module.js';
import { AlunosModule } from './alunos/alunos.module.js';
import { FichasModule } from './fichas/fichas.module.js';
import { SessoesTreinoModule } from './sessoes-treino/sessoes-treino.module.js';
import { PersonalModule } from './personal/personal.module.js';
import { SolicitacoesModule } from './solicitacoes/solicitacoes.module.js';
import { AppAlunoModule } from './app-aluno/app-aluno.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PersonalModule,
    ExerciciosModule,
    AlunosModule,
    FichasModule,
    SessoesTreinoModule,
    SolicitacoesModule,
    AppAlunoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
