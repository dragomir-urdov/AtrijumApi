import { ApiProperty } from '@nestjs/swagger';

import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class StoneDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}

export class StoneVariantDto {
  @ApiProperty()
  @IsInt()
  stone: number;

  @ApiProperty()
  size: string;
}

export class MetalVariantDto {
  @ApiProperty()
  @IsInt()
  metal: number;

  @ApiProperty()
  quality: number;

  @ApiProperty()
  color: string;
}

export class CreateProductVariantDto {
  @ApiProperty()
  @IsDecimal()
  price: number;

  @ApiProperty()
  @IsOptional()
  images?: string[];

  @ApiProperty()
  @IsInt()
  style: number;

  @ApiProperty()
  @IsInt()
  shape: number;

  @ApiProperty()
  @ValidateNested()
  stone: StoneVariantDto;

  @ApiProperty()
  @ValidateNested()
  metal: MetalVariantDto;
}

export class CreateVariantDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
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
  type: Variant;
}
