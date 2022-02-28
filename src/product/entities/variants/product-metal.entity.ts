import { Entity, OneToMany } from 'typeorm';

import { ProductVariantBase, ProductMetalVariant } from '@product/entities';

@Entity()
export class ProductMetal extends ProductVariantBase {
  @OneToMany(() => ProductMetalVariant, (variant) => variant.metal)
  variants: ProductMetalVariant[];
}
