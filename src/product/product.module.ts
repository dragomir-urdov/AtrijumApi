import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import {
  ProductService,
  CollectionService,
  VariantService,
} from '@product/services';

// Controllers
import {
  ProductController,
  CollectionController,
  VariantController,
} from '@product/controllers';

// Entities
import {
  Product,
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
