import { IQuery } from '@nestjs/cqrs';

export class GetUserVideoTreeQuery implements IQuery {
  constructor(public readonly id: string, public readonly userId: string) {}
}
