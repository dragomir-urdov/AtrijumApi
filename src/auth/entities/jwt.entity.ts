import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { User } from '@user/entities/user.entity';

@Entity({
  name: 'user_jwt',
})
// @Unique('device', ['os', 'platform', 'browser', 'user'])
export class Jwt extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'jwt_token',
    nullable: false,
    unique: true,
  })
  jwtToken: string;

  @Column({
    nullable: false,
    update: false,
  })
  os: string;

  @Column({
    nullable: false,
    update: false,
  })
  platform: string;

  @Column({
    nullable: false,
    update: false,
  })
  browser: string;

  @ManyToOne(() => User, (user) => user.jwtTokens, { onDelete: 'CASCADE' })
  user: User;
}
