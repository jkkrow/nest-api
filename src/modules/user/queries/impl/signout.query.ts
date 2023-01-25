import { IQuery } from '@nestjs/cqrs';

export class SignoutQuery implements IQuery {
  constructor(public readonly refreshToken: string) {}
}
