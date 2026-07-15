import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:52562',
      'http://localhost:3000',
      /^http:\/\/localhost(:\d+)?$/,
      'https://zap-construction.netlify.app',
      'https://projeto-final-hxph.vercel.app',
      'https://projeto-final.gabrielfr3245.workers.dev'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');
}

bootstrap();