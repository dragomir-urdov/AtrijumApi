import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    name: 'last_login_date',
    type: 'date',
  })
  lastLoginDate: Date;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({
    name: 'device_id',
  })
  deviceId: string;

  @Column({
    name: 'birth_date',
    type: 'date',
  })
  birthDate?: Date;
}
