import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { UserService } from '@user/user.service';
import { SharedService } from '@shared/shared.service';

import { Details } from 'express-useragent';

import { User } from '@user/entities/user.entity';
import { Device, Jwt } from './entities/jwt.entity';

import { CreateUserDto } from '@user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Jwt)
    private readonly jwtRepository: Repository<Jwt>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * It validates user data.
   *
   * @author Dragomir Urdov
   * @param email User email address.
   * @param password User password.
   * @returns User if there is user with specified email address and password match.
   */
  async validateUser(email: string, password: string) {
    const user = await User.findByEmail(email, true);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        delete user.password;
        return user;
      } else {
        throw new UnauthorizedException();
      }
    }

    throw new NotFoundException({
      message: 'User not found',
      status: HttpStatus.NOT_FOUND,
    });
  }

  /**
   * It creates new user and logged in them automatically.
   *
   * @author Dragomir Urdov
   * @param user User data
   * @returns
   */
  async signup(user: CreateUserDto, userAgent: Details): Promise<LoginUserDto> {
    const newUser = await this.userService.create(user);

    try {
      return this.login(newUser, userAgent);
    } catch (error) {
      await this.userService.delete(newUser.id);
      throw new InternalServerErrorException();
    }
  }

  /**
   * It logged in user issuing new jwt token.
   *
   * @author Dragomir Urdov
   * @param user User data.
   * @returns Jwt token and user data.
   */
  async login(user: User, userAgent: Details): Promise<LoginUserDto> {
    const payload = { email: user.email, id: user.id };
    const jwtToken = this.jwtService.sign(payload);

    const device = SharedService.encodeUserAgent(userAgent);

    let token = user.jwtTokens?.find((token) => token.device === device);

    if (token) {
      token.jwtToken = jwtToken;
    } else {
      token = new Jwt();
      token.device = device;
      token.jwtToken = jwtToken;
      token.user = user;
    }

    try {
      await this.jwtRepository.save(token);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    delete user.jwtTokens;

    return {
      jwt: {
        token: token.jwtToken,
        expiresIn: (this.jwtService.decode(jwtToken) as any).exp * 1000 - 10000,
      },
      user,
    };
  }

  async logout(user: User, userAgent: Details) {
    const device = SharedService.encodeUserAgent(userAgent);

    await this.jwtRepository.delete({
      device: device,
      user: user,
    });

    delete user.jwtTokens;

    return user;
  }
}
