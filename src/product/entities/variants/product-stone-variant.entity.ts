import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductVariant, ProductStone } from '@product/entities';

@Entity()
export class ProductStoneVariant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 20,
  })
  size: string;

  @ManyToOne(() => ProductStone, (stone) => stone.variants)
  stone: ProductStone;

  @OneToMany(() => ProductVariant, (variant) => variant.stoneVariant)
  variants?: ProductVariant[];
}
