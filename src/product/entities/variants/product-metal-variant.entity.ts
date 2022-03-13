import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductVariant, ProductMetal } from '@product/entities';

@Entity()
export class ProductMetalVariant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'tinyint',
  })
  quality: number;

  @Column({
    type: 'varchar',
    length: 20,
  })
  color: string;

  @ManyToOne(() => ProductMetal, (metal) => metal.variants)
  metal: ProductMetal;

  @OneToMany(() => ProductVariant, (variant) => variant.metalVariant)
  variants?: ProductVariant[];
}
