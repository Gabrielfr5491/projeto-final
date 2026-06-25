import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:4200', 
      'https://zap-construction.netlify.app' // 👈 TROQUE PELO SEU FRONT REAL
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');
}

bootstrap();