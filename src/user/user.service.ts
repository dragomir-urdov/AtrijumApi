import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * It insert new user in database if user not exists.
   *
   * @author Dragomir Urdov
   * @param createUserDto User data.
   * @returns Stored user data.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new User();

    const user = await this.findOne({ where: { email: createUserDto.email } });

    if (user) {
      throw new HttpException(
        {
          error: `User with ${user.email} email address already exists.`,
          status: HttpStatus.FORBIDDEN,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    newUser.email = createUserDto.email;
    newUser.password = createUserDto.password;
    newUser.confirmPassword = createUserDto.confirmPassword;
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;

    const savedUser = await this.userRepository.save(newUser);
    delete savedUser.password;

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
  async findOne(
    options: FindOneOptions<User>,
    includePassword = false,
  ): Promise<User> {
    const user = await this.userRepository.findOne(options);

    if (user && !includePassword) {
      delete user.password;
    }

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
    return this.userRepository.update(id, user);
  }

  /**
   * It deletes user.
   *
   * @author Dragomir Urdov
   * @param id User id.
   */
  async delete(id: number) {
    return this.userRepository.delete(id);
  }
}
