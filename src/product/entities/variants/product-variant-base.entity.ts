import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class ProductVariantBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;
}
