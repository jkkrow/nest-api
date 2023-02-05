import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

declare module 'typeorm/query-builder/SelectQueryBuilder' {
  interface SelectQueryBuilder<Entity> {
    getMapMany<T = Entity>(this: SelectQueryBuilder<Entity>): Promise<T[]>;
    getMapOne<T>(this: SelectQueryBuilder<Entity>): Promise<T | undefined>;
  }
}

SelectQueryBuilder.prototype.getMapMany = async function () {
  const { entities, raw } = await this.getRawAndEntities();

  const mappedEntities = entities.map((entity, index) => {
    const matchedRawItem = raw[index];

    Object.entries(matchedRawItem).forEach(([key, value]) => {
      if (key.includes('.')) {
        const [property, nestedProperty] = key.split(/\.(.*)/s);
        entity[property] = entity[property] || {};
        entity[property][nestedProperty] = value;
      } else {
        if (key.includes('_')) return;
        entity[key] = value;
      }
    });

    return entity;
  });

  return mappedEntities;
};

SelectQueryBuilder.prototype.getMapOne = async function () {
  const mappedEntities = await this.getMapMany();
  return mappedEntities[0];
};
