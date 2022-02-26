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
import { Exclude } from 'class-transformer';

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
  })
  @Exclude()
  password: string;

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
  @Exclude()
  jwtTokens: Jwt[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}

export enum UserRelations {
  JWT_TOKENS = 'jwtTokens',
}
