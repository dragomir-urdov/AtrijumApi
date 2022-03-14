import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
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

import {
  ProductDto,
  ProductItemsResDto,
  ProductOrderProperty,
  ProductQueryDto,
  ProductUpdateDto,
} from '@product/dto';
import { Connection, DeleteResult } from 'typeorm';
import { DatabaseOrder } from '@shared/models/database-order.model';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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
  async create(createProductDto: ProductDto, user: User): Promise<Product> {
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
            variant.metalVariant = await queryRunner.manager
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
            variant.stoneVariant = await queryRunner.manager
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
  async findAll(query: ProductQueryDto): Promise<ProductItemsResDto> {
    let queryBuilder = ProductVariant.createQueryBuilder('variant')

      // JOINS
      .leftJoin('variant.product', 'product')
      .leftJoin('product.collection', 'collection')

      .leftJoin('variant.style', 'style')
      .leftJoin('variant.shape', 'shape')

      .leftJoin('variant.stoneVariant', 'stoneVariant')
      .leftJoin('stoneVariant.stone', 'stone')

      .leftJoin('variant.metalVariant', 'metalVariant')
      .leftJoin('metalVariant.metal', 'metal')

      // Only published products
      .where('product.published = true')

      // SELECTIONS
      .select('product.id', 'id')
      .addSelect('product.title', 'title')
      .addSelect('product.image', 'image')
      .addSelect('product.createdAt', 'createdAt')

      .addSelect('collection.id', 'collectionId')

      .addSelect('metal.id', 'metalId')
      .addSelect('stone.id', 'stoneId')
      .addSelect('style.id', 'styleId')
      .addSelect('shape.id', 'shapeId')

      .addSelect('MAX(variant.price)', 'maxPrice')
      .addSelect('MIN(variant.price)', 'minPrice')

      // GROUP BY
      .groupBy('id')
      .addGroupBy('collectionId')
      .addGroupBy('metalId')
      .addGroupBy('stoneId')
      .addGroupBy('shapeId')
      .addGroupBy('styleId');

    // FILTERING
    if (query.collectionId) {
      queryBuilder = queryBuilder.having('collectionId = :collectionId', {
        collectionId: query.collectionId,
      });
    }
    if (query.metalId) {
      queryBuilder = queryBuilder.andHaving('metalId = :metalId', {
        metalId: query.metalId,
      });
    }
    if (query.shapeId) {
      queryBuilder = queryBuilder.andHaving('shapeId = :shapeId', {
        shapeId: query.shapeId,
      });
    }
    if (query.stoneId) {
      queryBuilder = queryBuilder.andHaving('stoneId = :stoneId', {
        stoneId: query.stoneId,
      });
    }
    if (query.styleId) {
      queryBuilder = queryBuilder.andHaving('styleId = :styleId', {
        styleId: query.styleId,
      });
    }

    if (query.order) {
      queryBuilder = queryBuilder.orderBy(
        query.orderBy ?? ProductOrderProperty.CREATED_AT,
        query.order ?? DatabaseOrder.ASC,
      );
    }

    queryBuilder = queryBuilder.maxExecutionTime(3000); // 3s

    try {
      const products = await queryBuilder.getRawMany();

      const response = new ProductItemsResDto();
      response.products = products.slice(
        ((query.page || 1) - 1) * (query.take ?? 20),
        query.take ?? 20,
      );
      response.count = products.length;

      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
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
