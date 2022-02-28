import { Entity, OneToMany } from 'typeorm';

import { ProductStoneVariant, ProductVariantBase } from '@product/entities';

@Entity()
export class ProductStone extends ProductVariantBase {
  @OneToMany(() => ProductStoneVariant, (variant) => variant.stone)
  variants: ProductStoneVariant[];
}
