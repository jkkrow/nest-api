import { IQuery } from '@nestjs/cqrs';

export class GetVideoTreeQuery implements IQuery {
  constructor(
    public readonly id: string,
    public readonly ip: string,
    public readonly userId?: string,
  ) {}
}
