import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { map } from 'rxjs';

export class CookieInterceptor implements NestInterceptor {
  constructor(
    private readonly key: string | string[],
    private readonly options: CookieOptions,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: any) => {
        const res = context.switchToHttp().getResponse<Response>();

        if (this.key instanceof Array) {
          this.key.forEach((key) => {
            res.cookie(key, data[key], this.options);
          });
        } else {
          res.cookie(this.key, data[this.key], this.options);
        }

        return data;
      }),
    );
  }
}
