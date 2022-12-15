import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

declare module 'typeorm/query-builder/SelectQueryBuilder' {
  interface SelectQueryBuilder<Entity> {
    getMapMany<T = Entity>(
      this: SelectQueryBuilder<Entity>,
      identifier?: string,
    ): Promise<T[]>;
    getMapOne<T>(
      this: SelectQueryBuilder<Entity>,
      identifier?: string,
    ): Promise<T | undefined>;
  }
}

SelectQueryBuilder.prototype.getMapMany = async function (identifier = 'id') {
  const { entities, raw } = await this.getRawAndEntities();
  const idKey = `${this.alias}_${identifier}`;

  const mappedEntities = entities.map((entity) => {
    const item = raw.find((rawItem) => rawItem[idKey] === entity[identifier]);

    for (const [key, value] of Object.entries<any>(item)) {
      if (key.includes('_')) continue;
      entity[key] = value;
    }

    return entity;
  });

  return mappedEntities;
};

SelectQueryBuilder.prototype.getMapOne = async function (identifier = 'id') {
  const mappedEntities = await this.getMapMany(identifier);
  return mappedEntities[0];
};
