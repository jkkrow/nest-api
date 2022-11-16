import { AggregateRoot } from '@nestjs/cqrs';

import { BaseEntity } from '../entities/database.entity';

export interface BaseFactory<
  TEntity extends BaseEntity,
  TModel extends AggregateRoot,
> {
  create(props: any): TModel;
  createEntity(model: TModel): TEntity;
  createFromEntity(entity: TEntity): TModel;
}
