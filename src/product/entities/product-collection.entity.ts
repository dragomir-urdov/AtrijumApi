import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductCollection extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  title: string;

  @Column({
    type: 'text',
  })
  description: string;

  @ManyToMany(() => Product, (product) => product.collections)
  @JoinTable({
    name: 'product_collection_products',
  })
  products!: Product[];
}
