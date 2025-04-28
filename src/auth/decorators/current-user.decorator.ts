import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = context.getArgByIndex(2); // GraphQL context is at index 2
    return ctx.req.user; // assuming you attach user to request after authentication
  },
);
