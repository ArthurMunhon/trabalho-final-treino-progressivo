import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // O cliente web da aula 13 consulta esta API diretamente pelo navegador.
  // Restringir a origem mantém explícito quem pode ler as respostas via CORS.
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3001',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      // remove do objeto os campos que o DTO não declara
      whitelist: true,
      // em vez de remover em silêncio, responde 400
      forbidNonWhitelisted: true,
      // entrega uma instância do DTO, não um objeto avulso
      transform: true,
      // converte "2" em 2 pela anotação do DTO, sem @Type() em cada campo
      transformOptions: { enableImplicitConversion: true },
    }),
  );
}
await bootstrap();
