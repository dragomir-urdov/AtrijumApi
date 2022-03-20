import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

// Decorators
import {
  UserAgent,
  UserAgentData,
} from '@auth/decorators/user-agent.decorator';
import { UserData } from '@auth/decorators/user.decorator';

// Services
import { AuthService } from '@auth/auth.service';

// Auth
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';

// Entities
import { User } from '@user/entities/user.entity';

// DTO
import {
  BadRequestExceptionDto,
  ForbiddenExceptionDto,
  NotFoundExceptionDto,
  UnauthorizedExceptionDto,
} from '@shared/dto/exception.dto';
import { SuccessDto } from '@shared/dto/success.dto';
import { UserCreateDto, UserResDto, UserLoginDto } from '@user/dto/user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup') // -----------------------------------------------------------
  @ApiBody({ type: UserCreateDto })
  @ApiCreatedResponse({ type: UserResDto, description: 'New user data.' })
  @ApiForbiddenResponse({
    type: ForbiddenExceptionDto,
    description: 'If user already exists',
  })
  @ApiBadRequestResponse({
    type: BadRequestExceptionDto,
    description: 'Wrong data like password and confirm password mismatches',
  })
  async signup(
    @Body() user: UserCreateDto,
    @UserAgent() userAgent: UserAgentData,
  ): Promise<UserResDto> {
    return this.authService.signup(user, userAgent);
  }

  @Post('login') // ------------------------------------------------------------
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: UserLoginDto,
    description: 'Existing user email and password.',
  })
  @ApiOkResponse({
    type: UserLoginDto,
    description: 'User successively logged in.',
  })
  @ApiNotFoundResponse({
    type: NotFoundExceptionDto,
    description: 'User with specified email address do not exists.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedExceptionDto,
    description: 'Wrong credentials.',
  })
  async login(
    @UserData() user: User,
    @UserAgent() userAgent: UserAgentData,
  ): Promise<UserResDto> {
    return this.authService.login(user, userAgent);
  }

  @Post('logout') // -----------------------------------------------------------
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: SuccessDto })
  @ApiUnauthorizedResponse({
    type: UnauthorizedExceptionDto,
    description: 'Only logged in user can access this endpoint.',
  })
  async logout(
    @UserData() user: User,
    @UserAgent() userAgent: UserAgentData,
  ): Promise<SuccessDto> {
    return this.authService.logout(user, userAgent);
  }

  @Post('reset-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: UserLoginDto,
    description: 'Token successfully restarted.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedExceptionDto,
    description: 'Wrong credentials.',
  })
  async resetToken(
    @UserData() user: User,
    @UserAgent() userAgent: UserAgentData,
  ): Promise<UserResDto> {
    return this.authService.resetToken(user, userAgent);
  }
}
