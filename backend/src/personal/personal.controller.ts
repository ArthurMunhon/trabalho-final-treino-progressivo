import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PersonalService } from './personal.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Controller('personal')
export class PersonalController {
  constructor(private readonly PersonalService: PersonalService) {}

  // POST /auth/register  { nome, email, senha }  ->  { accessToken, personal }
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.PersonalService.register(dto);
  }

  // POST /auth/login  { email, senha }  ->  { accessToken, personal }
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.PersonalService.login(dto);
  }
}
