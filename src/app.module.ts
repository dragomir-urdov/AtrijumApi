import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_FILTER } from '@nestjs/core';

import {
  AcceptLanguageResolver,
  I18nJsonLoader,
  I18nModule,
} from 'nestjs-i18n';

import * as path from 'path';

import { LoggerMiddleware } from '@shared/middlewares/logger.middleware';

// Configuration
import {
  ConfigKey,
  configuration,
  validationSchema,
} from 'config/configuration';

// Modules
import { ProductModule } from '@product/product.module';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { SharedModule } from '@shared/shared.module';
import { GalleryModule } from '@gallery/gallery.module';

import { Environment } from '@shared/models/environment.model';
import { AllExceptionsFilter } from '@shared/filters/all-exceptions.filter';

const modules = [
  SharedModule,
  UserModule,
  AuthModule,
  ProductModule,
  GalleryModule,
];

@Module({
  imports: [
    // ** Configuration **
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/${
        process.env.NODE_ENV || 'development'
      }.env`,
      load: [configuration],
      validationSchema,
      isGlobal: true,
    }),

    // ** Database **
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>(ConfigKey.DATABASE_HOST),
        port: configService.get<number>(ConfigKey.DATABASE_PORT),
        username: configService.get<string>(ConfigKey.DATABASE_USER),
        password: configService.get<string>(ConfigKey.DATABASE_PASSWORD),
        database: configService.get<string>(ConfigKey.DATABASE_NAME),
        autoLoadEntities: true,
        synchronize:
          configService.get<string>(ConfigKey.NODE_ENV) ===
          Environment.DEVELOPMENT,
        logging: ['error', 'info', 'log', 'warn'],
      }),
      inject: [ConfigService],
    }),

    // ** Localization **
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        'en-*': 'en',
      },
      loaderOptions: {
        path: path.join(__dirname, '..', 'i18n'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),

    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'files'),
    }),

    // ** Other modules **
    ...modules,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
