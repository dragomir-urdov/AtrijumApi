import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  MailDataRequired,
  MailService as SendgridService,
} from '@sendgrid/mail';

import { Environment } from '@shared/models/environment.model';
import { ConfigKey } from 'config/configuration';

@Injectable()
export class MailService {
  sendgridService = new SendgridService();

  environment = this.configService.get<Environment>(ConfigKey.NODE_ENV);

  sender = this.configService.get<string>(ConfigKey.SENDGRID_SENDER);
  devMail = this.configService.get<string>(ConfigKey.SENDGRID_DEV_MAIL);

  constructor(private readonly configService: ConfigService) {
    this.sendgridService.setApiKey(
      this.configService.get<string>(ConfigKey.SENDGRID_API_KEY),
    );
  }

  async send(message: Omit<MailDataRequired, 'from'>) {
    const mail = {
      ...message,
      from: this.sender,
    } as MailDataRequired;

    if (this.environment === Environment.DEVELOPMENT && this.devMail) {
      mail.to = this.devMail;
    }

    console.log('Mail => ', mail);

    return this.sendgridService.send(mail);
  }
}
