import { Module, OnModuleInit } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { PersonalModule } from '../personal/personal.module.js';

@Module({
  imports: [PersonalModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements OnModuleInit {
  // Falha logo ao subir (com mensagem clara) se esquecerem o segredo no .env
  onModuleInit() {
    if (!process.env.JWT_SECRET) {
      throw new Error('Defina JWT_SECRET no .env do backend');
    }
  }
}
