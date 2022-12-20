import { IQuery } from '@nestjs/cqrs';

export class GetCreatedVideoNodeQuery implements IQuery {
  constructor(
    public readonly id: string,
    public readonly treeId: string,
    public readonly creatorId: string,
  ) {}
}
