import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { User } from '@user/entities/user.entity';
import {
  Product,
  ProductMetal,
  ProductShape,
  ProductStone,
  ProductStyle,
  ProductCollection,
  ProductVariant,
  ProductMetalVariant,
  ProductStoneVariant,
  ALL_PRODUCT_RELATIONS,
} from '@product/entities';

import { CreateProductDto, UpdateProductDto } from '@product/dto';
import { Connection } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(private readonly connection: Connection) {}

  /**
   * It creates new product data.
   *
   * @author Dragomir Urdov
   * @param createProductDto Product data.
   * @param user User who creates new product.
   * @returns Saved product data.
   */
  async createProduct(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const collection = await queryRunner.manager.findOneOrFail(
        ProductCollection,
        createProductDto.collection,
      );

      const variants = [];
      for await (const item of createProductDto.variants) {
        const variant = ProductVariant.create();
        variant.price = item.price;

        variant.shape = await queryRunner.manager.findOne(
          ProductShape,
          item.shape,
        );
        variant.style = await queryRunner.manager.findOne(
          ProductStyle,
          item.style,
        );

        if (item.metal) {
          const metal = await queryRunner.manager.findOneOrFail(
            ProductMetal,
            item.metal.metal,
          );
          if (metal) {
            variant.metal = await queryRunner.manager
              .create(ProductMetalVariant, {
                metal,
                color: item.metal.color,
                quality: item.metal.quality,
              })
              .save();
          }
        }

        if (item.stone) {
          const stone = await queryRunner.manager.findOneOrFail(
            ProductStone,
            item.stone.stone,
          );
          if (stone) {
            variant.stone = await queryRunner.manager
              .create(ProductStoneVariant, {
                stone,
                size: item.stone.size,
              })
              .save();
          }
        }

        variants.push(await variant.save());
      }

      return await queryRunner.manager
        .create(Product, {
          user,
          title: createProductDto.title,
          description: createProductDto.description,
          details: createProductDto.details,
          variants,
          collection,
        })
        .save();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async findAllProducts() {
    return await Product.find({
      relations: ALL_PRODUCT_RELATIONS,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
