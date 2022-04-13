import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

// Entities
import {
  ProductMetal,
  ProductShape,
  ProductStone,
  ProductStyle,
  ProductVariantBase,
} from '@product/entities';

// DTO
import { VariantDto, Variant } from '@product/dto';

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
  async create(
    type: Variant,
    variant: VariantDto,
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
      throw new BadRequestException(error);
    }
  }

  /**
   * It retrieves all product variants.
   *
   * @author Dragomir Urdov
   * @returns All product variants.
   */
  async getAll() {
    try {
      const [stones, metals, shapes, styles] = await Promise.all([
        ProductStone.find(),
        ProductMetal.find(),
        ProductShape.find(),
        ProductStyle.find(),
      ]);

      return {
        stones,
        metals,
        shapes,
        styles,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
