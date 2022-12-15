import { IQuery } from '@nestjs/cqrs';

export class GetMyVideoTreeQuery implements IQuery {
  constructor(public readonly id: string, public readonly userId: string) {}
}
