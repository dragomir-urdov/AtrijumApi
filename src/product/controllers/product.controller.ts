import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

//  Auth
import { Public } from '@auth/guards/public.metadata';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { UserData } from '@auth/decorators/user.decorator';

// Service
import { ProductService } from '@product/services/product.service';

// Entities
import { User } from '@user/entities/user.entity';

// DTO
import { ProductDto, ProductResDto } from '@product/dto';
import {
  BadRequestExceptionDto,
  NotFoundExceptionDto,
  UnauthorizedExceptionDto,
} from '@shared/dto/exception.dto';

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
  @ApiOkResponse({ type: [ProductResDto] })
  findAll() {
    return this.productService.findAll();
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
}
