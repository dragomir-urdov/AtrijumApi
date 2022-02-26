import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

// Guards
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';

// Services
import { UserService } from '@user/user.service';

// DTO
import { UserResDataDto } from '@user/dto/user.dto';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id') //----------------------------------------------------------------
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserResDataDto })
  async findOne(@Param('id') id: number): Promise<UserResDataDto> {
    return this.userService.findOne({
      where: { id },
    });
  }
}
