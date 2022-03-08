import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Public } from '@auth/guards/public.metadata';

// Services
import { CollectionService } from '@product/services/collection.service';

// DTO
import { CreateCollectionDto } from '@product/dto';

@ApiTags('product')
@Controller('collection')
@UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post() // -------------------------------------------------------------------
  @ApiBearerAuth()
  createCollection(@Body() collection: CreateCollectionDto) {
    return this.collectionService.createCollection(collection);
  }

  @Get() //---------------------------------------------------------------------
  @Public()
  findAllCollections() {
    return this.collectionService.findAllCollections();
  }
}
