import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentAccount = createParamDecorator(
  (_: never, ctx: ExecutionContext) => {
    const context = GqlExecutionContext.create(ctx).getContext();
    return context.currentUser;
  },
);
