import { ApiProperty } from '@nestjs/swagger';

import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ProductVariantDto } from '@product/dto';
import { Type } from 'class-transformer';
import { ProductVariantResDto } from './variant.dto';

export class ProductDto {
  @IsInt()
  @Type(() => Number)
  @ApiProperty()
  collectionId!: number;

  @IsString()
  @ApiProperty()
  title!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  details?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  @ApiProperty({ type: () => [ProductVariantDto] })
  variants!: ProductVariantDto[];
}

export class ProductResDto extends ProductDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => [ProductVariantResDto] })
  variants: ProductVariantResDto[];
}
