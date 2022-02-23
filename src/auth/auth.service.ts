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

import { UserAgentData } from '@shared/models/user-agent.model';

import { User } from '@user/entities/user.entity';
import { Jwt } from '@auth/entities/jwt.entity';

import { CreateUserDto } from '@user/dto/create-user.dto';
import { LoginUserDto } from '@auth/dto/login-user.dto';
import { JwtPayload } from '@auth/dto/jwt-payload.dto';

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

    if (!user) {
      throw new NotFoundException({
        message: await this.sharedService.translate(
          'error.User Not Found',
          lang,
        ),
        status: HttpStatus.NOT_FOUND,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      delete user.password;
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

  /**
   * It validates jwt token and return user if it is valid.
   *
   * @author Dragomir Urdov
   * @param req Request.
   * @param payload Jwt payload.
   * @returns User data.
   */
  async validateJwt(jwt: string, payload: JwtPayload, lang: string) {
    const user = await this.userService.findOne({
      where: { id: payload.id },
      relations: ['jwtTokens'],
    });

    if (!user) {
      throw new NotFoundException({
        message: await this.sharedService.translate(
          'error.User Not Found',
          lang,
        ),
        status: HttpStatus.NOT_FOUND,
      });
    }

    const includeToken = user?.jwtTokens.find(
      (token) => token.jwtToken === jwt,
    );

    if (!includeToken) {
      throw new UnauthorizedException();
    }

    return user;
  }

  /**
   * It creates new user and logged in them automatically.
   *
   * @author Dragomir Urdov
   * @param user User data.
   * @param userAgent User device data.
   * @returns
   */
  async signup(
    user: CreateUserDto,
    userAgent: UserAgentData,
  ): Promise<LoginUserDto> {
    const newUser = await this.userService.create(user);

    try {
      const jwtToken = await this.issueJwtToken(newUser, userAgent);
      return {
        jwt: {
          token: jwtToken,
          expiresIn: this.jwtExpiresIn(jwtToken),
        },
        user: newUser,
      };
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
  async login(user: User, userAgent: UserAgentData): Promise<LoginUserDto> {
    const jwtToken = await this.issueJwtToken(user, userAgent);

    delete user.jwtTokens;

    return {
      jwt: {
        token: jwtToken,
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
  async logout(user: User, userAgent: UserAgentData): Promise<User> {
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
   * It updates user password.
   *
   * @author Dragomir Urdov
   * @param user User data
   * @param newPassword New user password.
   * @param confirmNewPassword Uew user password confirmation.
   * @returns
   */
  async resetPassword(
    user: User,
    newPassword: string,
    confirmNewPassword: string,
  ) {
    return this.userService.update(user.id, {
      password: newPassword,
      confirmPassword: confirmNewPassword,
    });
  }

  /**
   * It issue new jwt token.
   *
   * @author Dragomir Urdov
   * @param payload Jwt payload data.
   * @returns jwt token.
   */
  private async issueJwtToken(
    user: User,
    userAgent: UserAgentData,
  ): Promise<string> {
    const payload = { email: user.email, id: user.id } as JwtPayload;
    const jwtToken = await this.jwtService.signAsync(payload);

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

    return jwtToken;
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
