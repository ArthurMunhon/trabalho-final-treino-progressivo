import { Module } from '@nestjs/common';
import { FichasController } from './fichas.controller.js';
import { ItensFichaController } from './itens-ficha.controller.js';
import { FichasService } from './fichas.service.js';

@Module({
  controllers: [FichasController, ItensFichaController],
  providers: [FichasService],
})
export class FichasModule {}
