import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';

import {
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxDate,
  MinLength,
} from 'class-validator';
import { IsEqualTo } from '@shared/validators/is-equal-to.validator';

import { JwtTokenDto } from '@auth/dto/jwt-payload.dto';

class UserDto {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty()
  password: string;

  @IsString()
  @IsEqualTo('password')
  @ApiProperty()
  confirmPassword: string;

  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsOptional()
  @IsDate()
  @MaxDate(new Date())
  @ApiPropertyOptional()
  birthDate?: Date;
}

export class UserCreateDto extends OmitType(UserDto, ['id'] as const) {}

export class UserResDataDto extends OmitType(UserDto, [
  'password',
  'confirmPassword',
] as const) {}

export class UserResDto {
  @ApiProperty({ type: () => UserResDataDto })
  user: UserResDataDto;

  @ApiProperty({ type: () => JwtTokenDto })
  jwt: JwtTokenDto;
}

export class UserUpdateDto extends PartialType(UserDto) {}

export class UserLoginDto extends PickType(UserDto, [
  'email',
  'password',
] as const) {}
