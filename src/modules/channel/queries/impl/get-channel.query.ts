import { IQuery } from '@nestjs/cqrs';

export class GetChannelQuery implements IQuery {
  constructor(public readonly id: string, public readonly userId?: string) {}
}
