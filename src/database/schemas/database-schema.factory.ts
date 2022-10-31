import { AggregateRoot } from '@nestjs/cqrs';

import { DatabaseSchema } from './database.schema';

export interface DatabaseSchemaFactory<
  TSchema extends DatabaseSchema,
  TEntity extends AggregateRoot,
> {
  create(entity: TEntity): TSchema;
  createFromSchema(entitySchema: TSchema): TEntity;
}
