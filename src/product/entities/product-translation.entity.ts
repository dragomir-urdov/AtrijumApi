import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Language } from '@shared/entities/language.entity';

@Entity()
export class ProductTranslation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Language, (language) => language.productTranslations)
  language: Language;

  @Column({
    type: 'text',
  })
  text: string;
}
