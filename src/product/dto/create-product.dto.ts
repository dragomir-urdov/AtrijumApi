import { ApiProperty } from '@nestjs/swagger';

import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CreateProductVariantDto } from '@product/dto';

export class CreateProductDto {
  @ApiProperty()
  @IsInt()
  collection: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiProperty({
    type: [CreateProductVariantDto],
  })
  @IsArray()
  variants: CreateProductVariantDto[];
}
