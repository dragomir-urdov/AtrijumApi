import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { UserService } from '@user/user.service';
import { SharedService } from '@shared/services/shared.service';

import { Details } from 'express-useragent';

import { User } from '@user/entities/user.entity';
import { Jwt } from './entities/jwt.entity';

import { CreateUserDto } from '@user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Jwt)
    private readonly jwtRepository: Repository<Jwt>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly sharedService: SharedService,
  ) {}

  /**
   * It validates user data.
   *
   * @author Dragomir Urdov
   * @param email User email address.
   * @param password User password.
   * @param lang Language.
   * @returns User if there is user with specified email address and password match.
   */
  async validateUser(email: string, password: string, lang?: string) {
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
      message: await this.sharedService.translate('error.User Not Found', lang),
      status: HttpStatus.NOT_FOUND,
    });
  }

  /**
   * It creates new user and logged in them automatically.
   *
   * @author Dragomir Urdov
   * @param user User data.
   * @param userAgent User device data.
   * @returns
   */
  async signup(user: CreateUserDto, userAgent: Details): Promise<LoginUserDto> {
    const newUser = await this.userService.create(user);

    try {
      // Automatically login user after signup.
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
    // Create new jwt token.
    const payload = { email: user.email, id: user.id };
    const jwtToken = this.jwtService.sign(payload);

    const device = SharedService.encodeUserAgent(userAgent);

    let token = user.jwtTokens?.find((token) => token.device === device);

    if (token) {
      token.jwtToken = jwtToken;
    } else {
      // Save token with user and user device data.
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
        expiresIn: this.jwtExpiresIn(jwtToken),
      },
      user,
    };
  }

  /**
   * It logged user out.
   *
   * @author DragomirUrdov
   * @param user User data.
   * @param userAgent User device data.
   * @returns User data
   */
  async logout(user: User, userAgent: Details): Promise<User> {
    const device = SharedService.encodeUserAgent(userAgent);

    // Delete saved token for specified device.
    await this.jwtRepository.delete({
      device: device,
      user: user,
    });

    delete user.jwtTokens;

    return user;
  }

  /**
   * It decode jwt token and get expires in date.
   *
   * @author Dragomir Urdov
   * @param jwtToken Jwt token.
   * @returns Jwt expires in date in milliseconds.
   */
  private jwtExpiresIn(jwtToken: string): number {
    return (this.jwtService.decode(jwtToken) as any).exp * 1000 - 10000;
  }
}
