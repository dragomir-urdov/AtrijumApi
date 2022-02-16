import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Configuration
import { configuration, validationSchema } from 'config/configuration';

// Modules
import { ProductModule } from '@product/product.module';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';

const modules = [ProductModule, AuthModule, UserModule];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/${
        process.env.NODE_ENV || 'development'
      }.env`,
      load: [configuration],
      validationSchema,
      isGlobal: true,
    }),
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
    ...modules,
  ],
})
export class AppModule {}
