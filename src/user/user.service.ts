import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FindOneOptions } from 'typeorm';

// Entities
import { User } from '@user/entities/user.entity';

// DTO
import { UserCreateDto } from '@user/dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * It insert new user in database if user not exists.
   *
   * @author Dragomir Urdov
   * @param createUserDto User data.
   * @returns Stored user data.
   */
  async create(createUserDto: UserCreateDto): Promise<User> {
    const newUser = new User();

    const user = await this.findOne({ where: { email: createUserDto.email } });

    if (user) {
      throw new ForbiddenException(
        `User with ${user.email} email address already exists.`,
      );
    }

    newUser.email = createUserDto.email;
    newUser.password = createUserDto.password;
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;

    const savedUser = await User.save(newUser);

    return savedUser;
  }

  /**
   * It find user from database based on query options.
   *
   * @author Dragomir Urdov
   * @param options Query options.
   * @param includePassword Get user password.
   * @returns User data.
   */
  async findOne(options: FindOneOptions<User>): Promise<User> {
    const user = await User.findOne(options);

    return user;
  }

  /**
   * It updates user data.
   *
   * @author Dragomir Urdov
   * @param id User id.
   * @param user New user data.
   * @returns User data.
   */
  async update(id: number, user: Partial<User>) {
    return User.update(id, user);
  }

  /**
   * It deletes user.
   *
   * @author Dragomir Urdov
   * @param id User id.
   */
  async delete(id: number) {
    return User.delete(id);
  }
}
