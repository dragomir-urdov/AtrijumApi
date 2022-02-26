import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  MailDataRequired,
  MailService as SendgridService,
} from '@sendgrid/mail';

import { Environment } from '@shared/models/environment.model';

@Injectable()
export class MailService {
  sendgridService = new SendgridService();

  environment = this.configService.get<Environment>('environment');

  sender = this.configService.get<string>('sendgrid.sender');
  devMail = this.configService.get<string>('sendgrid.devMail');

  constructor(private readonly configService: ConfigService) {
    this.sendgridService.setApiKey(
      this.configService.get<string>('sendgrid.apiKey'),
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
