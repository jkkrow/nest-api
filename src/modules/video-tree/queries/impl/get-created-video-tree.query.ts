import { IQuery } from '@nestjs/cqrs';

export class GetCreatedVideoTreeQuery implements IQuery {
  constructor(public readonly id: string, public readonly creatorId: string) {}
}
