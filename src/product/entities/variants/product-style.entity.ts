import { Entity, OneToMany } from 'typeorm';

import { ProductVariant, ProductVariantBase } from '@product/entities';

@Entity()
export class ProductStyle extends ProductVariantBase {
  @OneToMany(() => ProductVariant, (variant) => variant.style)
  variants: ProductVariant[];
}
