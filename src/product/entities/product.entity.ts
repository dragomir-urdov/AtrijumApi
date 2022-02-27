import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductTranslation } from '@product/entities/product-translation.entity';
import { ProductVariant } from '@product/entities/product-variant.entity';
import { ProductCollection } from './product-collection.entity';

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

  @OneToMany(
    () => ProductTranslation,
    (translation) => translation.descriptions,
  )
  description?: ProductTranslation;

  @Column()
  details: string;

  @ManyToMany(() => ProductCollection, (collection) => collection.products)
  collections: ProductCollection[];

  @OneToMany(() => ProductVariant, (variant) => variant.products)
  variant: ProductVariant;
}
