import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { LanguageCode } from '@shared/models/language.model';
import { ProductTranslation } from '@product/entities/product-translation.entity';

@Entity()
export class Language extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: LanguageCode,
    default: LanguageCode.EN,
  })
  code: LanguageCode;

  @OneToMany(
    () => ProductTranslation,
    (productTranslation) => productTranslation.language,
  )
  productTranslations: ProductTranslation[];
}
