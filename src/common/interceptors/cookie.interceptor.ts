import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { map } from 'rxjs';

import { Exception } from '../exceptions';

export class CookieInterceptor implements NestInterceptor {
  constructor(
    private readonly key: string | string[],
    private readonly options: CookieOptions,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: any) => {
        const res = context.switchToHttp().getResponse<Response>();
        const cookieNames = this.key instanceof Array ? this.key : [this.key];

        for (const name of cookieNames) {
          const value = data[name];

          if (value === undefined) {
            throw new Exception('Unable to find cookie value in response');
          }

          res.cookie(name, value, this.options);
        }

        return data;
      }),
    );
  }
}
