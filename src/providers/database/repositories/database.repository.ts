import { SelectQueryBuilder as QueryBuilder, ObjectLiteral } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { FindOptions } from '../types/database.type';

export abstract class BaseRepository<
  T extends ObjectLiteral,
  K extends FindOptions<T, string>,
> {
  constructor(protected readonly alias: string) {
    this.alias = alias;
  }

  protected filterQuery(query: QueryBuilder<T>, options: K) {
    const { where, orderBy, groupBy, relation, pagination } = options;

    this.setWhere(query, where);
    this.setRelation(query, relation);
    this.setGroupBy(query, groupBy);
    this.setOrderBy(query, orderBy);
    this.setPagination(query, pagination);

    return query;
  }

  private setWhere(query: QueryBuilder<T>, where: K['where']) {
    if (!where) return;
    Object.entries(where).forEach(([key, value]) => {
      const property = this.parseKey(key);
      const uid = uuidv4().replace(/-/g, '');
      query.andWhere(`${property} = :${uid}`, { [uid]: value });
    });
  }

  private setRelation(query: QueryBuilder<T>, relation: K['relation']) {
    if (!relation) return;
    const { table, condition, type } = relation;
    const conditions: string[] = [];
    Object.entries(condition).forEach(([key, value]) => {
      const keyProp = this.parseKey(key);
      const valueProp = this.parseKey(value as string);
      conditions.push(keyProp + ' = ' + valueProp);
    });

    const alias = table;
    const conditionString = conditions.join(' AND ');

    switch (type) {
      case 'INNER':
        query.innerJoin(table, alias, conditionString);
        break;
      case 'LEFT':
        query.leftJoin(table, alias, conditionString);
        break;
      default:
        query.innerJoin(table, alias, conditionString);
        break;
    }
  }

  private setGroupBy(query: QueryBuilder<T>, groupBy: K['groupBy']) {
    if (!groupBy) return;
    Object.entries(groupBy).forEach(([key, value]) => {
      const property = this.parseKey(key);
      value && query.addGroupBy(property);
    });
  }

  private setOrderBy(query: QueryBuilder<T>, orderBy: K['orderBy']) {
    if (!orderBy) return;
    Object.entries(orderBy).forEach(([key, value]) => {
      const property = this.parseKey(key);
      query.addOrderBy(property, value);
    });
  }

  private setPagination(query: QueryBuilder<T>, pagination: K['pagination']) {
    if (!pagination) return;
    const { page, max } = pagination;
    query.limit(max);
    query.offset(max * (page - 1));
  }

  private parseComputeOperator() {
    return;
  }

  private parseKey(key: string) {
    const property = this.camelToSnake(key);
    return key.includes('.') ? property : `${this.alias}.${property}`;
  }

  private camelToSnake(key: string) {
    return key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
  }
}
