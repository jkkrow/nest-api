import {
  UseInterceptors,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  applyDecorators,
} from '@nestjs/common';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { map } from 'rxjs';
import { ApiResponse } from '@nestjs/swagger';

export interface SerializeOptions {
  status?: number;
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: T) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

export function Serialize<T>(
  dto: ClassConstructor<T>,
  options?: SerializeOptions,
) {
  const status = options?.status || 200;

  return applyDecorators(
    UseInterceptors(new SerializeInterceptor(dto)),
    ApiResponse({ type: dto, status }),
  );
}
