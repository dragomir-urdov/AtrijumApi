import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Product } from '@product/entities/product.entity';
import { ProductVariantShape } from '@product/entities/variants/product-variant-shape.entity';
import { ProductVariantStone } from '@product/entities/variants/product-variant-stone.entity';
import { ProductVariantMetal } from '@product/entities/variants/product-variant-metal.entity';
import { ProductVariantStyle } from '@product/entities/variants/product-variant-style.entity';

@Entity()
export class ProductVariant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (products) => products.variant)
  products!: Product[];

  @OneToOne(() => ProductVariantShape)
  @JoinColumn()
  shape!: ProductVariantShape;

  @OneToOne(() => ProductVariantStone)
  @JoinColumn()
  stone!: ProductVariantStone;

  @OneToOne(() => ProductVariantStyle)
  @JoinColumn()
  style!: ProductVariantStyle;

  @OneToOne(() => ProductVariantMetal)
  @JoinColumn()
  metal!: ProductVariantMetal;
}
