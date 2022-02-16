import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

const config = new DocumentBuilder()
  .setTitle('Atrijum Atelje')
  .setDescription('Simple Atriju Atelje API')
  .setVersion('1.0')
  .addTag('product')
  .build();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // OpenAPI
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Protection
  app.use(helmet());
  app.enableCors();

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3000);

  await app.listen(port);

  console.log(`App listening on localhost:${port}`);
}

bootstrap();
