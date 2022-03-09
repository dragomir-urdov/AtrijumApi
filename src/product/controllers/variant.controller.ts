import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';

// Services
import { VariantService } from '@product/services/variant.service';

// DTO
import { CreateVariantDto, VariantParams } from '@product/dto';

@ApiTags('product')
@Controller('variant')
@UseGuards(JwtAuthGuard)
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Post(':type') // ------------------------------------------------------------
  @ApiBearerAuth()
  create(@Param() params: VariantParams, @Body() variant: CreateVariantDto) {
    return this.variantService.create(params.type, variant);
  }
}
