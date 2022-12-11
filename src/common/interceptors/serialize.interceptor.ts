import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { map } from 'rxjs';

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
