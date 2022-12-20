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

    Object.entries(item).forEach(([key, value]) => {
      if (key.includes('_')) return;
      if (key.includes('.')) {
        const [property, nestedProperty] = key.split('.');
        entity[property] = entity[property] || {};
        entity[property][nestedProperty] = value;
      } else {
        entity[key] = value;
      }
    });

    return entity;
  });

  return mappedEntities;
};

SelectQueryBuilder.prototype.getMapOne = async function (identifier = 'id') {
  const mappedEntities = await this.getMapMany(identifier);
  return mappedEntities[0];
};
