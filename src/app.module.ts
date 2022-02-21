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
import { configuration, validationSchema } from 'config/configuration';

// Modules
import { ProductModule } from '@product/product.module';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { SharedModule } from './shared/shared.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@shared/filters/all-exceptions.filter';

const modules = [ProductModule, AuthModule, UserModule];

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
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    // ** Localization **
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get<string>('lang.default'),
        fallbacks: {
          'en-*': 'en',
        },
        parserOptions: {
          path: path.join(__dirname, '../i18n/'),
          watch: true,
        },
      }),
      parser: I18nJsonParser,
      resolvers: [AcceptLanguageResolver],
      inject: [ConfigService],
    }),

    // ** Other modules **
    SharedModule,
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
