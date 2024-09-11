import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import * as express from 'express';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { TelegramService } from './telegram/telegram.service';
import { AllExceptionsFilter } from './telegram/all-exceptions.filter';
import { LanguageInterceptor } from './interceptors/language/language.interceptor';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Ratbikes')
    .setDescription('Endpoints')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configuración de CORS solo en producción
  if (process.env.NODE_ENV === 'production') {
    app.enableCors({
      origin: 'https://ratwave.com',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders:
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length, User-Agent, Accept-Encoding, Connection, Host, lang',
    });
  }

  // Middleware para manejar JSON y URL encoding
  app.use(json({ limit: '10000mb' }));
  app.use(urlencoded({ extended: true, limit: '10000mb' }));

  // Middleware para servir archivos estáticos
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  
  const telegramService = app.get(TelegramService);

  app.useGlobalInterceptors(new LanguageInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(telegramService));

  // Iniciar la aplicación
  await app.listen(4000);
}

bootstrap();
