import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { ProductService } from '@product/product.service';

// Controllers
import { ProductController } from '@product/product.controller';

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
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
