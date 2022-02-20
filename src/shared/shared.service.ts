import { Device } from '@auth/entities/jwt.entity';
import { Injectable } from '@nestjs/common';
import { Details } from 'express-useragent';

@Injectable()
export class SharedService {
  static encodeBase64(obj: any): string {
    return Buffer.from(JSON.stringify(obj)).toString('base64');
  }

  static decodeBase64<T>(base64: string): T {
    return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8')) as T;
  }

  static encodeUserAgent(userAgent: Details) {
    const deviceData = {
      os: userAgent.os,
      platform: userAgent.platform,
      browser: userAgent.browser,
    } as Device;
    return this.encodeBase64(deviceData);
  }
}
