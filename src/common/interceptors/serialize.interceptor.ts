import {
  UseInterceptors,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import {
  plainToInstance,
  ClassConstructor,
  ClassTransformOptions,
} from 'class-transformer';

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(
    private dto: ClassConstructor<T>,
    private options?: ClassTransformOptions,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: T) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
          ...this.options,
        });
      }),
    );
  }
}

export function Serialize<T>(
  dto: ClassConstructor<T>,
  options?: ClassTransformOptions,
) {
  return UseInterceptors(new SerializeInterceptor(dto, options));
}
