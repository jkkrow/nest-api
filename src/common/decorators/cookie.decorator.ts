import {
  UseInterceptors,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request, CookieOptions } from 'express';

import { CookieInterceptor } from '../interceptors/cookie.interceptor';

export function SetCookie(keys: string | string[], options?: CookieOptions) {
  const cookieOptions: CookieOptions = {
    secure: true,
    sameSite: 'strict',
    ...options,
  };
  return UseInterceptors(new CookieInterceptor(keys, cookieOptions));
}

export const Cookie = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const { cookies } = context.switchToHttp().getRequest<Request>();
    return cookies[key];
  },
);
