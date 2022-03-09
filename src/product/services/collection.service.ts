import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// Entities
import {
  ProductCollection,
  ProductCollectionRelation,
} from '@product/entities';

// DTO
import { CreateCollectionDto } from '@product/dto';

@Injectable()
export class CollectionService {
  /**
   * It creates new collection.
   *
   * @author Dragomir Urdov
   * @param collection Collection data.
   * @returns Saved collection data
   */
  async create(collection: CreateCollectionDto): Promise<ProductCollection> {
    try {
      return await ProductCollection.create(collection).save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * It return all collections.
   *
   * @author Dragomir Urdov
   * @returns All Collections data.
   */
  async findAll(): Promise<ProductCollection[]> {
    return await ProductCollection.find();
  }

  /**
   * It returns collection data.
   *
   * @author Dragomir Urdov
   * @param id Collection id.
   * @returns Collection data.
   */
  async find(id: number): Promise<ProductCollection> {
    try {
      return await ProductCollection.findOneOrFail({
        where: { id },
        relations: [ProductCollectionRelation.PRODUCTS],
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
