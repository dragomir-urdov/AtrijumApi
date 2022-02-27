import { Entity } from 'typeorm';

import { ProductVariantBase } from './product-variant-base.entity';

@Entity()
export class ProductVariantMetal extends ProductVariantBase {}
