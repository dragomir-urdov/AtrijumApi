import { ApiProperty } from '@nestjs/swagger';

export class SuccessDto {
  @ApiProperty()
  status: number;

  @ApiProperty()
  message: string;
}
