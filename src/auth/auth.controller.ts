import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { UserAgent } from './decorators/user-agent.decorator';
import { UserData } from './decorators/user.decorator';

import { AuthService } from './auth.service';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { CreateUserDto } from '@user/dto/create-user.dto';

import { Details } from 'express-useragent';
import { User } from '@user/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() user: CreateUserDto, @UserAgent() userAgent: Details) {
    return this.authService.signup(user, userAgent);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@UserData() user: User, @UserAgent() userAgent: Details) {
    return this.authService.login(user, userAgent);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@UserData() user: User, @UserAgent() userAgent: Details) {
    return this.authService.logout(user, userAgent);
  }
}
