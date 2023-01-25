import { IQuery } from '@nestjs/cqrs';

export class GetSessionQuery implements IQuery {
  constructor(public readonly refreshToken: string) {}
}
