import { IQuery } from '@nestjs/cqrs';

export class GetSubscribersQuery implements IQuery {
  constructor(
    public readonly id: string,
    public readonly page?: number,
    public readonly max?: number,
  ) {}
}
