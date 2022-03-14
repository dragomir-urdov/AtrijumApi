import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Exclude, Type } from 'class-transformer';

import { ProductVariantDto, ProductVariantResDto } from '@product/dto';
import { DatabaseOrder } from '@shared/models/database-order.model';
import { PartialType } from '@nestjs/mapped-types';

/**
 * Base Product DTO for create new product.
 */
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

  @IsString()
  @ApiProperty()
  image: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  @ApiProperty({ type: () => [ProductVariantDto] })
  variants!: ProductVariantDto[];
}

export class ProductUpdateDto extends PartialType(ProductDto) {}

/**
 * Created product
 */
export class ProductResDto extends ProductDto {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;

  @ApiResponseProperty({ type: () => [ProductVariantResDto] })
  variants: ProductVariantResDto[];
}

/**
 * Product list item
 */
export class ProductItemResDto {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  title: string;

  @ApiResponseProperty()
  maxPrice: number;

  @ApiResponseProperty()
  minPrice: number;

  @ApiResponseProperty()
  image: string;

  @Exclude()
  shapeId: number;

  @Exclude()
  stoneId: number;

  @Exclude()
  metalId: number;

  @Exclude()
  styleId: number;
}

export class ProductItemsResDto {
  @ApiResponseProperty({ type: () => [ProductItemResDto] })
  @Type(() => ProductItemResDto)
  products: ProductItemResDto[];

  @ApiResponseProperty()
  count: number;
}

export enum ProductOrderProperty {
  PRICE = 'minPrice',
  CREATED_AT = 'createdAt',
  TITLE = 'title',
}

/**
 * Product query params
 */
export class ProductQueryDto {
  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  collectionId?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  metalId?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  stoneId?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  shapeId?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  styleId?: number;

  @ApiProperty({ required: false, default: 20 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  take?: number;

  @ApiProperty({ required: false, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    required: false,
    type: () => ProductOrderProperty,
    enum: ProductOrderProperty,
    default: ProductOrderProperty.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(ProductOrderProperty)
  orderBy?: ProductOrderProperty;

  @ApiProperty({
    required: false,
    type: () => DatabaseOrder,
    enum: DatabaseOrder,
    default: DatabaseOrder.ASC,
  })
  @IsOptional()
  @IsEnum(DatabaseOrder)
  order?: DatabaseOrder;
}
