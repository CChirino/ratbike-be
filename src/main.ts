import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { json, urlencoded } from 'express';

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

  // Configuración de CORS
  app.enableCors({
    origin: 'https://ratwave.com',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  });

  // Middleware para manejar las solicitudes preflight (opciones)
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://ratwave.com');
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
    } else {
      next();
    }
  });

  // Middleware para manejar JSON y URL encoding
  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ extended: true, limit: '20mb' }));

  // Middleware para servir archivos estáticos
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Iniciar la aplicación
  await app.listen(3000);
}

bootstrap();
