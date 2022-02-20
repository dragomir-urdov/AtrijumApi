import { User } from '@user/entities/user.entity';

export class LoginUserDto {
  jwt: {
    token: string;
    expiresIn: number;
  };
  user: User;
}
