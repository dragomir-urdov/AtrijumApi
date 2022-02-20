import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { ConfigService } from '@nestjs/config';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '@user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
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
  async validate(req: Request, payload: any) {
    const user = await this.userService.findOne({
      where: { id: payload.id },
      relations: ['jwtTokens'],
    });

    const includeToken = user?.jwtTokens.find(
      (token) => token.jwtToken === req.headers.authorization.split(' ')[1],
    );

    if (!user || !includeToken) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
