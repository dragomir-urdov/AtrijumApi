import { HttpException, HttpStatus } from '@nestjs/common';

import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Jwt } from '@auth/entities/jwt.entity';

import * as bcrypt from 'bcrypt';

@Entity({
  name: 'user',
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  @Index({ unique: true })
  email: string;

  @Column({
    nullable: false,
    select: false,
  })
  password: string;

  confirmPassword?: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({
    name: 'birth_date',
    type: 'date',
    nullable: true,
  })
  birthDate?: Date;

  @OneToMany(() => Jwt, (jwt) => jwt.user, {
    cascade: true,
  })
  jwtTokens: Jwt[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.confirmPassword && this.confirmPassword !== this.password) {
      throw new HttpException(
        {
          error: `Passwords don't match.`,
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    delete this.confirmPassword;

    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  static findByEmail(email: string, includePassword = false) {
    let query = this.createQueryBuilder('user')
      .where('user.email = :email', {
        email,
      })
      .leftJoinAndSelect('user.jwtTokens', 'jwt');

    if (includePassword) {
      query = query.addSelect('user.password');
    }

    return query.getOne();
  }
}
