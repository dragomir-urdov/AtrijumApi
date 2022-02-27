import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { ProductService } from '@product/product.service';

// Controllers
import { ProductController } from '@product/product.controller';

// Entities
import { Product } from '@product/entities/product.entity';
import { ProductTranslation } from '@product/entities/product-translation.entity';
import { ProductCollection } from '@product/entities/product-collection.entity';
import { ProductVariant } from '@product/entities/product-variant.entity';
import { ProductVariantShape } from '@product/entities/variants/product-variant-shape.entity';
import { ProductVariantStone } from '@product/entities/variants/product-variant-stone.entity';
import { ProductVariantStyle } from '@product/entities/variants/product-variant-style.entity';
import { ProductVariantMetal } from '@product/entities/variants/product-variant-metal.entity';
import { ProductVariantImage } from '@product/entities/variants/product-variant-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductTranslation,
      ProductCollection,
      ProductVariant,
      ProductVariantShape,
      ProductVariantStone,
      ProductVariantStyle,
      ProductVariantMetal,
      ProductVariantImage,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
