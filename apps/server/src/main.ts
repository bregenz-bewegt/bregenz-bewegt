/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as path from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  app.enableCors({ origin: true });

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Bregenz Bewegt API')
      .setVersion('1.0')
      .build()
  );
  SwaggerModule.setup(`${globalPrefix}/swagger`, app, document);

  const port = process.env.NX_API_PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
