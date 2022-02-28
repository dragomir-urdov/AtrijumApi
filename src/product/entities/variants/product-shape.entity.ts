import { Entity, OneToMany } from 'typeorm';

import { ProductVariant, ProductVariantBase } from '@product/entities';

@Entity()
export class ProductShape extends ProductVariantBase {
  @OneToMany(() => ProductVariant, (variant) => variant.shape)
  variants: ProductVariant;
}
