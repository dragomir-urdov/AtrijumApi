import {
  BaseEntity,
  Column,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductVariant } from '@product/entities/product-variant.entity';
import { ProductVariantImage } from './product-variant-image.entity';

export abstract class ProductVariantBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => ProductVariantImage, (image) => image.variant)
  images: ProductVariantImage[];

  @OneToOne(() => ProductVariant)
  variant: ProductVariant;
}
