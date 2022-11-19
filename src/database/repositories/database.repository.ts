import { AggregateRoot } from '@nestjs/cqrs';
import { FindOptionsWhere, Repository } from 'typeorm';

import { BaseEntity } from '../entities/database.entity';
import { BaseFactory } from '../factories/database.factory';

export abstract class BaseRepository<
  TEntity extends BaseEntity,
  TModel extends AggregateRoot,
> {
  constructor(
    protected readonly repository: Repository<TEntity>,
    protected readonly factory: BaseFactory<TEntity, TModel>,
  ) {}

  protected async _findOne(entityFilterQuery: FindOptionsWhere<TEntity>) {
    const entity = await this.repository.findOneBy(entityFilterQuery);
    return entity ? this.factory.createFromEntity(entity) : null;
  }

  protected async _find(entityFilterQuery: FindOptionsWhere<TEntity>) {
    const entities = await this.repository.findBy(entityFilterQuery);
    return entities.map((entity) => this.factory.createFromEntity(entity));
  }

  protected async _save(model: TModel) {
    const entity = this.factory.createEntity(model);
    await this.repository.save(entity);
  }

  protected async _delete(model: TModel) {
    const entity = this.factory.createEntity(model);
    await this.repository.remove(entity);
  }
}
