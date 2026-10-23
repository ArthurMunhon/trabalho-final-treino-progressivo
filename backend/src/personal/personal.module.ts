import { Module, OnModuleInit } from '@nestjs/common';
import { PersonalController } from './personal.controller.js';
import { PersonalService } from './personal.service.js';

@Module({
  controllers: [PersonalController],
  providers: [PersonalService],
})
export class PersonalModule implements OnModuleInit {
  // Falha logo ao subir (com mensagem clara) se esquecerem o segredo no .env
  onModuleInit() {
    if (!process.env.JWT_SECRET) {
      throw new Error('Defina JWT_SECRET no .env do backend');
    }
  }
}
