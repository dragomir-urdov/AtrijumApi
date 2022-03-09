import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Public } from '@auth/guards/public.metadata';

// Services
import { CollectionService } from '@product/services/collection.service';

// DTO
import { CollectionResDto, CreateCollectionDto } from '@product/dto';

@ApiTags('product')
@Controller('collection')
@UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post() // -------------------------------------------------------------------
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CollectionResDto })
  create(@Body() collection: CreateCollectionDto) {
    return this.collectionService.create(collection);
  }

  @Get() //---------------------------------------------------------------------
  @Public()
  @ApiOkResponse({ type: [CollectionResDto] })
  findAll() {
    return this.collectionService.findAll();
  }

  @Get(':id') //----------------------------------------------------------------
  @Public()
  @ApiOkResponse({ type: CollectionResDto })
  find(@Param('id') id: number) {
    return this.collectionService.find(id);
  }
}
