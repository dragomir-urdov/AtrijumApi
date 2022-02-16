import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    unique: true,
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  title: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  description?: string;
}
