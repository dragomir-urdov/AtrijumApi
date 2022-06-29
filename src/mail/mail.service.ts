import { Injectable } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(user: User) {
    const url = `http://localhost:3000/auth/activate-user?token=${user.activationSecret}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation',
      context: {
        name: user.firstName,
        url,
      },
    });
  }
}
