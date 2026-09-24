import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ExerciciosModule } from './exercicios/exercicios.module.js';
import { AlunosModule } from './alunos/alunos.module.js';
import { FichasModule } from './fichas/fichas.module.js';
import { SessoesTreinoModule } from './sessoes-treino/sessoes-treino.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ExerciciosModule,
    AlunosModule,
    FichasModule,
    SessoesTreinoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
