import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Public } from '@auth/guards/public.metadata';

// Services
import { CollectionService } from '@product/services/collection.service';
import { SharedService } from '@shared/services/shared.service';

// DTO
import { CollectionResDto, CreateCollectionDto } from '@product/dto';
import {
  NotFoundExceptionDto,
  UnauthorizedExceptionDto,
} from '@shared/dto/exception.dto';
import { Response } from 'express';

@ApiTags('product')
@Controller('collection')
@UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post() // -------------------------------------------------------------------
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files/collections',
        filename: SharedService.editFileName,
      }),
      fileFilter: SharedService.imageFileFilter,
      limits: {
        fileSize: 2000000, // 2MB
      },
    }),
  )
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    type: CollectionResDto,
    description: 'Create new collection and return stored collection data',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedExceptionDto,
    description: 'Only logged in user can access this endpoint.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          nullable: false,
        },
        title: {
          type: 'string',
          nullable: false,
        },
        description: {
          type: 'string',
          nullable: true,
        },
      },
    },
  })
  create(
    @UploadedFile() image: Express.Multer.File,
    @Body() collection: CreateCollectionDto,
  ) {
    if (!image) {
      throw new BadRequestException('Image is required!');
    }
    return this.collectionService.create(collection, image?.filename);
  }

  @Get('image/:name') // -------------------------------------------------------
  @Public()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'file',
    },
  })
  image(@Param('name') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: 'files/collections' });
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
