import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SharedService {
  constructor(
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * It encodes object to Base64 string.
   *
   * @author Dragomir Urdov
   * @param obj Any object to be encoded.
   * @returns Encoded Base64 string.
   */
  static encodeBase64(obj: any): string {
    return Buffer.from(JSON.stringify(obj)).toString('base64');
  }

  /**
   * It decode Base64 string.
   *
   * @author Dragomir Urdov
   * @param base64 Base64 encoded string.
   * @returns Data decoded from Base64 string.
   */
  static decodeBase64<T>(base64: string): T {
    return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8')) as T;
  }

  /**
   * It translates message.
   *
   * @author Dragomir Urdov
   * @param message Message to be translated.
   * @param lang Language in witch message will be translated.
   * @param args Additional message arguments.
   * @returns Translated message.
   */
  async translate(message: string, lang?: string, args?: any): Promise<string> {
    lang = lang ?? this.configService.get<string>('lang.default');

    try {
      return await this.i18n.translate(message, { lang, args });
    } catch (error) {
      return message;
    }
  }
}
