import { IQuery } from '@nestjs/cqrs';

export class GetAuthTokenQuery implements IQuery {
  constructor(public readonly refreshToken: string) {}
}
