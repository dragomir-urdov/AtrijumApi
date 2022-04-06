import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AcceptLanguageResolver,
  I18nJsonParser,
  I18nModule,
} from 'nestjs-i18n';

import * as path from 'path';

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

import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@shared/filters/all-exceptions.filter';
import { Environment } from '@shared/models/environment.model';
import { ServeStaticModule } from '@nestjs/serve-static';

const modules = [SharedModule, UserModule, AuthModule, ProductModule];

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
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get<string>(ConfigKey.DEFAULT_LANG),
        fallbacks: {
          'en-*': 'en',
        },
        parserOptions: {
          path: path.join(__dirname, '..', 'i18n'),
          watch: true,
        },
      }),
      parser: I18nJsonParser,
      resolvers: [AcceptLanguageResolver],
      inject: [ConfigService],
    }),

    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', 'files'),
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
export class AppModule {}
