import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFiles,
  Res,
  HttpStatus,
  Patch,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import {
  ApiBadRequestResponse,
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

//  Auth
import { Public } from '@auth/guards/public.metadata';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { UserData } from '@auth/decorators/user.decorator';

// Service
import { ProductService } from '@product/services/product.service';
import { SharedService } from '@shared/services/shared.service';

// Entities
import { User } from '@user/entities/user.entity';

// DTO
import {
  ProductDto,
  ProductItemsResDto,
  ProductQueryDto,
  ProductResDto,
  ProductUpdateDto,
} from '@product/dto';
import {
  BadRequestExceptionDto,
  NotFoundExceptionDto,
  UnauthorizedExceptionDto,
} from '@shared/dto/exception.dto';
import { Response } from 'express';

@ApiTags('product')
@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post() //--------------------------------------------------------------------
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: ProductResDto,
    description: 'It creates new product and return stored product data.',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedExceptionDto,
    description: 'Only logged in user can access this endpoint.',
  })
  @ApiBadRequestResponse({ type: BadRequestExceptionDto })
  create(@UserData() user: User, @Body() createProductDto: ProductDto) {
    return this.productService.create(createProductDto, user);
  }

  @Get() //---------------------------------------------------------------------
  @Public()
  @ApiOkResponse({ type: ProductItemsResDto })
  findAll(@Query() query: ProductQueryDto): Promise<ProductItemsResDto> {
    return this.productService.findAll(query);
  }

  @Get(':id') //----------------------------------------------------------------
  @Public()
  @ApiOkResponse({ type: ProductResDto })
  @ApiNotFoundResponse({ type: NotFoundExceptionDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Delete(':id') //-------------------------------------------------------------
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
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
    return res.sendFile(image, { root: 'files/products' });
  }

  @Post('images') // -----------------------------------------------------------
  @UseInterceptors(
    FilesInterceptor('images', null, {
      storage: diskStorage({
        destination: './files/products',
        filename: SharedService.editFileName,
      }),
      fileFilter: SharedService.imageFileFilter,
      limits: {
        fileSize: 2000000, // 2MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadImages(@UploadedFiles() images: Array<Express.Multer.File>) {
    return {
      images: images.map((image) => ({
        name: image.filename,
        path: image.path,
      })),
    };
  }
}
