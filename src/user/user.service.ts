import { Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();

    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new UnauthorizedException();
    }

    const salt = await bcrypt.genSalt(10);

    console.log(createUserDto, salt);

    const hashPassword = await bcrypt.hash(createUserDto.password, salt);

    user.email = createUserDto.email;
    user.password = hashPassword;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;

    return this.userRepository.save(user);
  }

  async findOne(
    options: FindOneOptions<User>,
    includePassword = false,
  ): Promise<User> {
    const user = await this.userRepository.findOne(options);

    if (!includePassword) {
      delete user.password;
    }

    return user;
  }
}
