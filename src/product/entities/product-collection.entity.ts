import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Product } from '@product/entities';

@Entity()
export class ProductCollection extends BaseEntity {
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

  @OneToMany(() => Product, (product) => product.collection, {
    cascade: true,
  })
  products!: Product[];
}

export enum ProductCollectionRelation {
  PRODUCTS = 'products',
}
