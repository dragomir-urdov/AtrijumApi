import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import {
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class StoneVariantDto {
  @IsInt()
  @ApiProperty()
  stoneId!: number;

  @ApiProperty()
  @IsString()
  size!: string;
}

export class MetalVariantDto {
  @IsInt()
  @ApiProperty()
  metalId!: number;

  @IsInt()
  @ApiProperty()
  quality!: number;

  @IsString()
  @ApiProperty()
  color!: string;
}

export class CreateProductVariantDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  price!: number;

  @IsOptional()
  @ApiProperty()
  images?: string[];

  @IsInt()
  @Type(() => Number)
  @ApiProperty()
  styleId!: number;

  @IsInt()
  @Type(() => Number)
  @ApiProperty()
  shapeId!: number;

  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => StoneVariantDto)
  @ApiProperty()
  stoneVariant!: StoneVariantDto;

  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => MetalVariantDto)
  @ApiProperty()
  metalVariant!: MetalVariantDto;
}

export class CreateVariantDto {
  @IsString()
  @ApiProperty()
  title!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;
}

export enum Variant {
  METAL = 'metal',
  SHAPE = 'shape',
  STONE = 'stone',
  STYLE = 'style',
}

export class VariantParams {
  @IsEnum(Variant)
  @ApiProperty()
  type!: Variant;
}
