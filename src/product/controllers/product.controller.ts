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
import { CreateProductDto } from '@product/dto';

@ApiTags('product')
@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post() //--------------------------------------------------------------------
  @ApiBearerAuth()
  create(@UserData() user: User, @Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto, user);
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

  @Delete(':id') //-------------------------------------------------------------
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
