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
import { UserData } from '@auth/decorators/user.decorator';

// Service
import { ProductService } from '@product/services/product.service';

// Entities
import { User } from '@user/entities/user.entity';

// DTO
import { CreateProductDto, UpdateProductDto } from '@product/dto';

@ApiTags('product')
@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post() //--------------------------------------------------------------------
  @ApiBearerAuth()
  create(@UserData() user: User, @Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto, user);
  }

  @Get() //---------------------------------------------------------------------
  @Public()
  findAllProducts() {
    return this.productService.findAllProducts();
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
