import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import {
  Product,
  ProductMetalVariant,
  ProductStoneVariant,
  ProductStyle,
  ProductShape,
} from '@product/entities';
import { ProductImage } from './product-image.entity';

@Entity()
@Unique('unique_product_variant', [
  'product',
  'metalVariant',
  'stoneVariant',
  'style',
  'shape',
])
export class ProductVariant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'float',
  })
  price: number;

  @OneToMany(() => ProductImage, (image) => image.variant)
  images: ProductImage[];

  @ManyToOne(() => Product, (products) => products.variants, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => ProductMetalVariant, (metal) => metal.variants)
  metalVariant: ProductMetalVariant;

  @ManyToOne(() => ProductStoneVariant, (metal) => metal.variants)
  stoneVariant: ProductStoneVariant;

  @ManyToOne(() => ProductStyle, (style) => style.variants)
  style: ProductStyle;

  @ManyToOne(() => ProductShape, (shape) => shape.variants)
  shape: ProductShape;
}
