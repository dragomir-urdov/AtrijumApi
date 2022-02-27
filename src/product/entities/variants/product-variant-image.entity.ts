import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ProductVariantBase } from './product-variant-base.entity';

@Entity()
export class ProductVariantImage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  variant: ProductVariantBase;
}
