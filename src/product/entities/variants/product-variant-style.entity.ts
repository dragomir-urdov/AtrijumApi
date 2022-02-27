import { Entity } from 'typeorm';

import { ProductVariantBase } from './product-variant-base.entity';

@Entity()
export class ProductVariantStyle extends ProductVariantBase {}
