import { extname, join } from 'path';

import { BadRequestException, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { ConfigKey } from 'config/configuration';

import { I18nService } from 'nestjs-i18n';
import { Request } from 'express';

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
    lang = lang ?? this.configService.get<string>(ConfigKey.DEFAULT_LANG);

    try {
      return await this.i18n.translate(message, { lang, args });
    } catch (error) {
      return message;
    }
  }

  /**
   * It filters images files.
   *
   * @author Dragomir Urdov
   * @param req Request data
   * @param file File data
   * @param callback Does file match requirements.
   */
  static imageFileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: (error: any | null, pass: boolean) => void,
  ) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return callback(
        new BadRequestException('Only image files are allowed!'),
        false,
      );
    }
    callback(null, true);
  };

  /**
   * It determines file name.
   *
   * @author Dragomir Urdov
   * @param req Request data.
   * @param file File data
   * @param callback File name.
   */
  static editFileName = (
    req: Request,
    file: Express.Multer.File,
    callback: (error: any | null, fileName: string) => void,
  ) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
  };

  /**
   * It determines file destination based on album property.
   * @note Album property in request param or body is required!
   *
   * @author Dragomir Urdov
   * @param req Request data.
   * @param file File data.
   * @param callback File destination.
   */
  static imagesDestination = (
    req: Request,
    file: Express.Multer.File,
    callback: (error: any | null, destination: string) => void,
  ) => {
    const destination = join(
      '.',
      'files',
      req.params.album ?? req.body.album ?? '',
    );
    callback(null, destination);
  };
}
