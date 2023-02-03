import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

declare module 'typeorm/query-builder/SelectQueryBuilder' {
  interface SelectQueryBuilder<Entity> {
    getMapMany<T = Entity>(
      this: SelectQueryBuilder<Entity>,
      identifier?: string[],
    ): Promise<T[]>;
    getMapOne<T>(
      this: SelectQueryBuilder<Entity>,
      identifier?: string[],
    ): Promise<T | undefined>;
  }
}

SelectQueryBuilder.prototype.getMapMany = async function (identifier = ['id']) {
  const { entities, raw } = await this.getRawAndEntities();
  const idKeys = identifier.map((id) => `${this.alias}_${id}`);

  const mappedEntities = entities.map((entity) => {
    const matchedRawItem = raw.find((rawItem) =>
      idKeys.every((idKey, i) => rawItem[idKey] === entity[identifier[i]]),
    );

    Object.entries(matchedRawItem).forEach(([key, value]) => {
      if (key.includes(`${this.alias}_`)) return;
      if (key.includes('.')) {
        const [property, nestedProperty] = key.split(/\.(.*)/s);
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

SelectQueryBuilder.prototype.getMapOne = async function (identifier = ['id']) {
  const mappedEntities = await this.getMapMany(identifier);
  return mappedEntities[0];
};
