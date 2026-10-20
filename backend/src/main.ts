import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS só importa se o navegador chamar a API direto; hoje o fetch roda no servidor do Next
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Back-end na porta 3001 (o Next usa a 3000)
  await app.listen(3001);
  console.log('🚀 Servidor NestJS rodando com sucesso na porta 3001!');
}
bootstrap();
