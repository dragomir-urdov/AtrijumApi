import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { ConfigService } from '@nestjs/config';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '@auth/auth.service';

import { JwtPayload } from '@auth/dto/jwt-payload.dto';
import { Headers } from '@shared/models/headers.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
      passReqToCallback: true,
    });
  }

  /**
   * It validates JWT token.
   *
   * @author Dragomir Urdov
   * @param payload JWT payload data.
   * @returns User data.
   */
  async validate(req: Request, payload: JwtPayload) {
    const jwt = req.headers.authorization?.split(' ')[1];
    const lang = req.headers[Headers.ACCEPT_LANGUAGE];

    return await this.authService.validateJwt(jwt, payload, lang);
  }
}
