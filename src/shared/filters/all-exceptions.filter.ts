import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { I18nService } from 'nestjs-i18n';

import { Response } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    let message = exception.getResponse() as {
      message: string;
      status: number;
    };

    try {
      message = await this.i18n.translate(message.message, {
        lang: ctx.getRequest().i18nLang ?? 'en',
      });
    } catch (error) {
      // Message will remain untranslated.
    } finally {
      response.status(statusCode).json({ statusCode, message });
    }
  }
}
