import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Public } from '@auth/guards/public.metadata';

// Services
import { CollectionService } from '@product/services/collection.service';

// DTO
import { CollectionResDto, CreateCollectionDto } from '@product/dto';
import {
  NotFoundExceptionDto,
  UnauthorizedExceptionDto,
} from '@shared/dto/exception.dto';

@ApiTags('product')
@Controller('collection')
@UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post() // -------------------------------------------------------------------
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CollectionResDto,
    description: 'Create new collection and return stored collection data',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedExceptionDto,
    description: 'Only logged in user can access this endpoint.',
  })
  create(@Body() collection: CreateCollectionDto) {
    return this.collectionService.create(collection);
  }

  @Get() //---------------------------------------------------------------------
  @Public()
  @ApiOkResponse({
    type: [CollectionResDto],
    description: 'Return all collections',
  })
  findAll() {
    return this.collectionService.findAll();
  }

  @Get(':id') //----------------------------------------------------------------
  @Public()
  @ApiOkResponse({
    type: CollectionResDto,
    description: 'Return collection data founded by collection id.',
  })
  @ApiNotFoundResponse({
    type: NotFoundExceptionDto,
    description: 'If there is no collection with specified id.',
  })
  find(@Param('id', ParseIntPipe) id: number) {
    return this.collectionService.find(id);
  }
}
