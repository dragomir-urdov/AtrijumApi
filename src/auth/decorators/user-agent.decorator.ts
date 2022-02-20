import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';
import { Details } from 'express-useragent';

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Details => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.useragent;
  },
);
