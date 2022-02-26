import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';
import { Details } from 'express-useragent';

export type UserAgentData = Details;

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserAgentData => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.useragent;
  },
);
