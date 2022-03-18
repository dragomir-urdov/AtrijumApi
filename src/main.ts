import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKey } from 'config/configuration';

import helmet from 'helmet';
import * as UserAgent from 'express-useragent';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { Environment } from '@shared/models/environment.model';

const config = new DocumentBuilder()
  .setTitle('Atrijum Atelje')
  .setDescription('Simple Atriju Atelje API')
  .addTag('user', 'User management')
  .addTag('auth', 'Authentication endpoints')
  .addTag('product', 'Product management')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Config
  const configService = app.get(ConfigService);
  const port = configService.get<number>(ConfigKey.PORT, 3000);
  const origin = [configService.get<string>(ConfigKey.CORS_ORIGIN)];
  const isDevelopmentEnvironment =
    configService.get<string>(ConfigKey.NODE_ENV) === Environment.DEVELOPMENT;

  if (isDevelopmentEnvironment) {
    // OpenAPI
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // Protection
  app.use(helmet());

  // User agent
  app.use(UserAgent.express());
  app.enableCors({
    origin,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Accept', 'Content-Type', 'Authorization'],
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Global Interceptors
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  await app.listen(port);

  if (isDevelopmentEnvironment) {
    console.log(
      `App listening on port ${port}\nVisit API documentation at: http://localhost:${port}/api`,
    );
  }
}

bootstrap();
