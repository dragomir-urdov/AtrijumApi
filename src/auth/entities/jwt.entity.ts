import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@user/entities/user.entity';

@Entity({
  name: 'user_jwt',
})
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
    update: false,
    nullable: false,
    name: 'device',
    type: 'varchar',
  })
  device: string;

  @ManyToOne(() => User, (user) => user.jwtTokens, { onDelete: 'CASCADE' })
  user: User;
}

export class Device {
  os: string;
  platform: string;
  browser: string;
}
