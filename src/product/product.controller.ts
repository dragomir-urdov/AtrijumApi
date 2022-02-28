import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

//  Auth
import { Public } from '@auth/guards/public.metadata';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';

// Service
import { ProductService } from '@product/product.service';

// DTO
import { CreateProductDto, UpdateProductDto } from '@product/dto';

@ApiTags('product')
@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post() //--------------------------------------------------------------------
  @ApiBearerAuth()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get() //---------------------------------------------------------------------
  @Public()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id') //----------------------------------------------------------------
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id') //--------------------------------------------------------------
  @ApiBearerAuth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id') //-------------------------------------------------------------
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
