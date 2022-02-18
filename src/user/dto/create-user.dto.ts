import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
  @IsString()
  confirmPassword: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
}
