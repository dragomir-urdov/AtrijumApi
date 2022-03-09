import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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

import { CreateProductDto } from '@product/dto';
import { Connection, DeleteResult } from 'typeorm';

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
  async create(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const collection = await queryRunner.manager.findOneOrFail(
        ProductCollection,
        createProductDto.collectionId,
      );

      const variants: ProductVariant[] = [];

      for await (const item of createProductDto.variants) {
        const variant = ProductVariant.create();
        variant.price = item.price;

        variant.shape = await queryRunner.manager.findOneOrFail(
          ProductShape,
          item.shapeId,
        );
        variant.style = await queryRunner.manager.findOneOrFail(
          ProductStyle,
          item.styleId,
        );

        if (item.metalVariant) {
          const metal = await queryRunner.manager.findOneOrFail(
            ProductMetal,
            item.metalVariant.metalId,
          );
          if (metal) {
            variant.metal = await queryRunner.manager
              .create(ProductMetalVariant, {
                metal,
                color: item.metalVariant.color,
                quality: item.metalVariant.quality,
              })
              .save();
          }
        }

        if (item.stoneVariant) {
          const stone = await queryRunner.manager.findOneOrFail(
            ProductStone,
            item.stoneVariant.stoneId,
          );
          if (stone) {
            variant.stone = await queryRunner.manager
              .create(ProductStoneVariant, {
                stone,
                size: item.stoneVariant.size,
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
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * It return all products data.
   *
   * @author Dragomir Urdov
   * @returns All products data.
   */
  async findAll(): Promise<Product[]> {
    return await Product.find({
      relations: ALL_PRODUCT_RELATIONS,
    });
  }

  /**
   * It returns founded product searched by product id.
   *
   * @author Dragomir Urdov
   * @param id Product id.
   * @returns Product data.
   */
  async findOne(id: number): Promise<Product> {
    try {
      return await Product.findOneOrFail({
        where: { id },
        relations: ALL_PRODUCT_RELATIONS,
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  /**
   * It remove product.
   *
   * @author Dragomir Urdov
   * @param id Product id.
   * @returns Deleted product.
   */
  async remove(id: number): Promise<DeleteResult> {
    return await Product.delete(id);
  }
}
