import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Jwt } from '@auth/entities/jwt.entity';
import { Product } from '@product/entities';

import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  CREATOR = 'creator',
}

@Entity({
  name: 'user',
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    nullable: false,
  })
  @Exclude()
  password: string;

  @Column({
    nullable: true,
    name: 'password_secret',
    type: 'varchar',
    length: 36,
  })
  passwordSecret?: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({
    nullable: true,
  })
  image?: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({
    name: 'birth_date',
    type: 'date',
    nullable: true,
  })
  birthDate?: Date;

  @Column({
    nullable: true,
    name: 'activation_secret',
    type: 'varchar',
    length: 36,
  })
  activationSecret?: string; // If null, then user activated account.

  @Column({
    default: false,
    name: 'is_deleted',
  })
  isDeleted: boolean;

  @OneToMany(() => Jwt, (jwt) => jwt.user, {
    cascade: true,
  })
  @Exclude()
  jwtTokens: Jwt[];

  @OneToMany(() => Product, (product) => product.user, { cascade: true })
  products: Product[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @BeforeInsert()
  async generateActivationSecret() {
    this.activationSecret = uuidv4();
  }

  @BeforeUpdate()
  async generatePasswordSecret() {
    if (this.password) {
      this.passwordSecret = uuidv4();
    }
  }
}

export enum UserRelations {
  JWT_TOKENS = 'jwtTokens',
}
