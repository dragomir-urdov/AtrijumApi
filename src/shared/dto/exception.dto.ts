import { ApiProperty } from '@nestjs/swagger';

/**
 * Base Http Exception DTO.
 */
export abstract class HttpExceptionDto {
  @ApiProperty()
  status: number;

  @ApiProperty()
  message: string;
}

/**
 * Base Unauthorized Exception DTO.
 */
export class BadRequestExceptionDto extends HttpExceptionDto {
  @ApiProperty({ example: 400 })
  status: 400;
}

/**
 * Base Unauthorized Exception DTO.
 */
export class UnauthorizedExceptionDto extends HttpExceptionDto {
  @ApiProperty({ example: 401 })
  status: 401;
}

export class ForbiddenExceptionDto extends HttpExceptionDto {
  @ApiProperty({ example: 403 })
  status: 403;
}

/**
 * Base Not Found Exception DTO.
 */
export class NotFoundExceptionDto extends HttpExceptionDto {
  @ApiProperty({ example: 404 })
  status: 404;
}
