import { Module } from '@nestjs/common';
import { SessoesTreinoController } from './sessoes-treino.controller.js';
import { SessoesTreinoService } from './sessoes-treino.service.js';

@Module({
  controllers: [SessoesTreinoController],
  providers: [SessoesTreinoService],
})
export class SessoesTreinoModule {}
