import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductVariant, ProductStone } from '@product/entities';

@Entity()
export class ProductStoneVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'float',
  })
  size: number;

  @ManyToOne(() => ProductStone, (stone) => stone.variants)
  stone: ProductStone;

  @OneToMany(() => ProductVariant, (variant) => variant.stone)
  variants: ProductVariant[];
}
