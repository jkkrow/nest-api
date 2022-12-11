import { UseInterceptors, applyDecorators, HttpCode } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { ApiResponse } from '@nestjs/swagger';

import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

export interface SerializeOptions {
  status?: number;
}

export function Serialize<T>(
  dto: ClassConstructor<T>,
  options?: SerializeOptions,
) {
  const status = options?.status || 200;

  return applyDecorators(
    UseInterceptors(new SerializeInterceptor(dto)),
    HttpCode(status),
    ApiResponse({ type: dto, status }),
  );
}
