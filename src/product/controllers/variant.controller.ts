import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';

// Services
import { VariantService } from '@product/services/variant.service';

// DTO
import { VariantDto, VariantParams, VariantResDto } from '@product/dto';
import {
  BadRequestExceptionDto,
  UnauthorizedExceptionDto,
} from '@shared/dto/exception.dto';

@ApiTags('product')
@Controller('variant')
@UseGuards(JwtAuthGuard)
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Post(':type') // ------------------------------------------------------------
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: VariantResDto })
  @ApiBadRequestResponse({ type: BadRequestExceptionDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedExceptionDto })
  create(@Param() params: VariantParams, @Body() variant: VariantDto) {
    return this.variantService.create(params.type, variant);
  }
}
