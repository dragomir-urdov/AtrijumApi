import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';
import { UserAgentData } from '@shared/models/user-agent.model';

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserAgentData => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.useragent;
  },
);
