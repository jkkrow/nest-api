import { NotFoundException } from '@nestjs/common';
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

  protected async findOne(
    entityFilterQuery: FindOptionsWhere<TEntity>,
    notFoundError?: boolean,
  ) {
    const entity = await this.repository.findOneBy(entityFilterQuery);

    if (!entity && notFoundError) {
      throw new NotFoundException('Entity not found.');
    }

    return entity ? this.factory.createFromEntity(entity) : null;
  }

  protected async find(entityFilterQuery: FindOptionsWhere<TEntity>) {
    const entities = await this.repository.findBy(entityFilterQuery);

    return entities.map((entity) => this.factory.createFromEntity(entity));
  }

  protected async create(props: any) {
    const model = this.factory.create(props);

    await this.repository.save(this.factory.createEntity(model));

    return model;
  }

  protected async update(
    entityFilterQuery: FindOptionsWhere<TEntity>,
    model: TModel,
  ) {
    const entity = await this.repository.findOneBy(entityFilterQuery);
    const updatedEntity = this.factory.createEntity(model);

    if (!entity) {
      throw new NotFoundException('Entity not found.');
    }

    for (const key in updatedEntity) {
      entity[key] = updatedEntity[key];
    }

    await this.repository.save(entity);

    return model;
  }

  protected async delete(entityFilterQuery: FindOptionsWhere<TEntity>) {
    const entity = await this.repository.findOneBy(entityFilterQuery);

    if (!entity) {
      throw new NotFoundException('Entity not found.');
    }

    await this.repository.remove(entity);
  }
}
