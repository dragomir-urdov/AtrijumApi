import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '@auth/auth.service';

import { Request } from 'express';
import { Headers } from '@shared/models/headers.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  /**
   * It validates user login credentials.
   *
   * @author Dragomir Urdov
   * @param email User email address.
   * @param password User password.
   * @returns User data.
   */
  async validate(req: Request, email: string, password: string) {
    const lang = req.headers[Headers.ACCEPT_LANGUAGE];
    const user = await this.authService.validateUser(email, password, lang);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
