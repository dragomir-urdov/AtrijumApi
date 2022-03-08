import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { ProductService } from '@product/services/product.service';
import { CollectionService } from '@product/services/collection.service';
import { VariantService } from '@product/services/variant.service';

// Controllers
import { ProductController } from '@product/controllers/product.controller';
import { CollectionController } from '@product/controllers/collection.controller';
import { VariantController } from '@product/controllers/variant.controller';

// Entities
import {
  Product,
  ProductTranslation,
  ProductCollection,
  ProductImage,
  ProductVariant,
  ProductMetal,
  ProductMetalVariant,
  ProductStone,
  ProductStoneVariant,
  ProductStyle,
  ProductShape,
} from '@product/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductTranslation,
      ProductCollection,
      ProductImage,
      ProductVariant,
      ProductMetal,
      ProductMetalVariant,
      ProductStone,
      ProductStoneVariant,
      ProductStyle,
      ProductShape,
    ]),
  ],
  controllers: [ProductController, CollectionController, VariantController],
  providers: [ProductService, CollectionService, VariantService],
  exports: [ProductService],
})
export class ProductModule {}
