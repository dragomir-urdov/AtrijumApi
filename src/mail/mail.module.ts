import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { MailService } from '@mail/mail.service';
import { ConfigKey } from 'config/configuration';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>(ConfigKey.MAIL_HOST),
          port: configService.get<number>(ConfigKey.MAIL_PORT),
          auth: {
            user: configService.get<string>(ConfigKey.MAIL_USER),
            pass: configService.get<string>(ConfigKey.MAIL_PASSWORD),
          },
        },
        defaults: {
          from: configService.get<string>(ConfigKey.MAIL_FROM),
        },
        template: {
          dir: join(process.cwd(), 'dist', 'mail', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
