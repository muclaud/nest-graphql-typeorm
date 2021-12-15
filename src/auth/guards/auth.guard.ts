import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UseGuards,
  mixin,
  Type,
} from '@nestjs/common';

import { GqlExecutionContext } from '@nestjs/graphql';

import { AuthService } from '../auth.service';
import { ACCESS_TOKEN, TokenPayload } from '../helpers/auth.types';

export const Authorize = (...roles: string[]) => {
  return UseGuards(AuthGuard(roles));
};

export function AuthGuard(roles: string[]): Type<CanActivate> {
  @Injectable()
  class AuthGuardMixin implements CanActivate {
    constructor(private authService: AuthService) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
      const context = GqlExecutionContext.create(ctx).getContext();
      const { req } = context;

      if (req.cookies) {
        const accessToken = req.cookies[ACCESS_TOKEN.key];
        console.log('🚀: AuthGuard -> accessToken', accessToken);
        if (accessToken) {
          try {
            const { email } = this.authService.verifyToken(
              accessToken,
            ) as TokenPayload;
            if (email) {
              context.currentUser = await this.authService.findByEmail(email);
            }
          } catch (error) {
            console.log('🚀 AuthGuard -> accessTokenError', error);
          }
        }
      }

      if (context.currentUser) {
        console.log('🚀: AuthGuard -> currentUser', context.currentUser);
        const { role } = context.currentUser;
        if (!roles.length || roles.includes(role)) return true;
      }

      return false;
    }
  }

  return mixin(AuthGuardMixin);
}
