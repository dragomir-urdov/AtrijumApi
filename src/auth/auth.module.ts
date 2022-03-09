import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigKey } from 'config/configuration';

// Modules
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

// Entities
import { Jwt } from '@auth/entities/jwt.entity';

// Strategies
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { LocalStrategy } from '@auth/strategies/local.strategy';

// Models
import { UserModule } from '@user/user.module';
import { MailModule } from '@mail/mail.module';

// Controllers
import { AuthController } from './auth.controller';

// Services
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([Jwt]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(ConfigKey.JWT_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(ConfigKey.JWT_EXPIRES_IN),
        },
      }),
      inject: [ConfigService],
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
