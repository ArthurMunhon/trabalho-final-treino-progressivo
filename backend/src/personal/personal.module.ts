import { Module } from '@nestjs/common';
import { PersonalController } from './personal.controller.js';
import { PersonalService } from './personal.service.js';

@Module({
  controllers: [PersonalController],
  providers: [PersonalService],
  exports: [PersonalService], // o AuthModule usa no login e no cadastro
})
export class PersonalModule {}
