import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '@user/dto/create-user.dto';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserData } from './decorators/user.decorator';
import { User } from '@user/entities/user.entity';
import { UserAgent } from './decorators/user-agent.decorator';
import { Details } from 'express-useragent';

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
}
