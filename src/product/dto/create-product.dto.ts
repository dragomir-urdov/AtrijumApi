import { ApiProperty } from '@nestjs/swagger';

import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CreateProductVariantDto } from '@product/dto';
import { Type } from 'class-transformer';

export class CreateProductDto {
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
  @Type(() => CreateProductVariantDto)
  @ApiProperty({ type: () => [CreateProductVariantDto] })
  variants!: CreateProductVariantDto[];
}
