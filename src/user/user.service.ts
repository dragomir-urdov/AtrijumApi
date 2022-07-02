import { ForbiddenException, Injectable } from '@nestjs/common';

import { FindOneOptions, Repository } from 'typeorm';

// Entities
import { User } from '@user/entities/user.entity';

// DTO
import { UserCreateDto } from '@user/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

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
    newUser.username = createUserDto.username;
    newUser.password = createUserDto.password;
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;
    newUser.image = createUserDto.image;

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
  async update(where: Partial<User>, user: Partial<User>) {
    return User.update(where, user);
  }

  /**
   * It deletes user.
   *
   * @author Dragomir Urdov
   * @param id User id.
   */
  async delete(id: string) {
    return User.delete(id);
  }
}
