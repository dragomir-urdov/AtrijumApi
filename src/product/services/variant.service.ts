import { ForbiddenException, Injectable } from '@nestjs/common';

// Entities
import {
  ProductMetal,
  ProductShape,
  ProductStone,
  ProductStyle,
  ProductVariantBase,
} from '@product/entities';

// DTO
import { CreateVariantDto, Variant } from '@product/dto';

@Injectable()
export class VariantService {
  /**
   * It creates new variant data.
   *
   * @author Dragomir Urdov
   * @param type Variant type.
   * @param variant Variant data.
   * @returns Saved variant data.
   */
  async createVariant(
    type: Variant,
    variant: CreateVariantDto,
  ): Promise<ProductVariantBase> {
    try {
      switch (type) {
        case Variant.STONE:
          return await ProductStone.create(variant).save();
        case Variant.METAL:
          return await ProductMetal.create(variant).save();
        case Variant.SHAPE:
          return await ProductShape.create(variant).save();
        case Variant.STYLE:
          return await ProductStyle.create(variant).save();
      }
    } catch (error) {
      throw new ForbiddenException('Already exists');
    }
  }
}
