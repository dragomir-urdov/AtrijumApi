import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedService {
  static encodeBase64(obj: any): string {
    return Buffer.from(JSON.stringify(obj)).toString('base64');
  }

  static decodeBase64<T>(base64: string): T {
    return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8')) as T;
  }
}
