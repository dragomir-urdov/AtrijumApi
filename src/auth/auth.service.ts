import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { UserService } from '@user/user.service';
import { CreateUserDto } from '@user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne({ where: { email } }, true);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        return user;
      }
    }

    return null;
  }

  async signup(user: CreateUserDto) {
    return this.userService.create(user);
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id };
    return {
      jwt_token: this.jwtService.sign(payload),
    };
  }
}
