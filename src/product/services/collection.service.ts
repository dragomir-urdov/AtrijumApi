import { Injectable } from '@nestjs/common';

// Entities
import { ProductCollection } from '@product/entities';

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
  async createCollection(
    collection: CreateCollectionDto,
  ): Promise<ProductCollection> {
    return await ProductCollection.create(collection).save();
  }

  async findAllCollections() {
    return await ProductCollection.find();
  }
}
