import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductVariant, ProductCollection } from '@product/entities';
import { User } from '@user/entities/user.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({ nullable: true })
  details?: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @ManyToOne(() => ProductCollection, (collection) => collection.products)
  collection: ProductCollection;

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariant[];
}

export enum ProductRelations {
  VARIANTS = 'variants',
  VARIANTS_METAL = 'variants.metal',
  VARIANTS_STYLE = 'variants.style',
  VARIANTS_STONE = 'variants.stone',
  VARIANTS_SHAPE = 'variants.shape',
  COLLECTION = 'collection',
  USER = 'user',
}

export const ALL_PRODUCT_RELATIONS = Object.values(ProductRelations);
export const ALL_PRODUCT_VARIANTS = [
  ProductRelations.VARIANTS,
  ProductRelations.VARIANTS_METAL,
  ProductRelations.VARIANTS_SHAPE,
  ProductRelations.VARIANTS_STONE,
  ProductRelations.VARIANTS_STYLE,
];
