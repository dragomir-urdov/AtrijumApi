import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

// Models
import { Response } from 'express';

// Services
import { SharedService } from '@shared/services/shared.service';
import { GalleryService } from './gallery.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';

@Controller('gallery')
@ApiTags('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  getAlbums() {
    return this.galleryService.getAlbums();
  }

  @Get(':album') // ------------------------------------------------------------
  getImages(@Param('album') album: string) {
    return this.galleryService.getAllImages(album);
  }

  @Get(':album/:image') // -----------------------------------------------------
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'file',
    },
  })
  getImage(
    @Param('album') album: string,
    @Param('image') image: string,
    @Res() res: Response,
  ) {
    return res.sendFile(image, { root: `files/${album}` });
  }

  @Post('products') // -------------------------------------------------------------------
  @UseGuards(JwtAuthGuard)
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
  uploadProductImages(@UploadedFiles() images: Array<Express.Multer.File>) {
    return {
      images: images.map((image) => ({
        name: image.filename,
        path: image.path,
      })),
    };
  }
}
