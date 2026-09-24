import { Module } from '@nestjs/common';
import { ExerciciosController } from './exercicios.controller.js';
import { ExerciciosService } from './exercicios.service.js';

@Module({
  controllers: [ExerciciosController],
  providers: [ExerciciosService],
})
export class ExerciciosModule {}
