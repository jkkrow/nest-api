import {
  SelectQueryBuilder as QueryBuilder,
  ObjectLiteral,
  FindOperator,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { FindOptions } from '../types/database.type';

export abstract class BaseRepository<
  T extends ObjectLiteral,
  K extends FindOptions<T, string>,
> {
  constructor(protected readonly alias: string) {}

  protected filterQuery(query: QueryBuilder<T>, options: K) {
    const { where, search, orderBy, groupBy, relation, pagination } = options;

    this.setWhere(query, where);
    this.setSearch(query, search);
    this.setRelation(query, relation);
    this.setGroupBy(query, groupBy);
    this.setOrderBy(query, orderBy);
    this.setPagination(query, pagination);

    return query;
  }

  private setWhere(query: QueryBuilder<T>, where: K['where']) {
    if (!where) return;
    Object.entries(where).forEach(([key, operator]) => {
      const property = this.parseKey(key);
      const uid = uuidv4().replace(/-/g, '');
      const [expression, value] = this.parseFindOperator(operator, uid);
      query.andWhere(`${property} ${expression}`, { [uid]: value });
    });
  }

  private setSearch(query: QueryBuilder<T>, search: K['search']) {
    if (!search) return;
    const uid = uuidv4().replace(/-/g, '');
    query.andWhere(`search @@ plainto_tsquery(:${uid})`, { [uid]: search });
    query.addOrderBy(`ts_rank(search, plainto_tsquery(:${uid}))`, 'DESC');
  }

  private setRelation(query: QueryBuilder<T>, relation: K['relation']) {
    if (!relation) return;
    const { table, condition, type } = relation;
    const conditions = Object.entries(condition).map(([key, value]) => {
      const keyProp = this.parseKey(key);
      const valueProp = this.parseKey(value as string);
      return `${keyProp} = ${valueProp}`;
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

  private parseFindOperator(operator: FindOperator<any> | any, uid: string) {
    if (!(operator instanceof FindOperator)) return [`= :${uid}`, operator];
    switch (operator.type) {
      case 'equal':
        return [`= :${uid}`, operator.value];
      case 'moreThan':
        return [`> :${uid}`, operator.value];
      case 'lessThan':
        return [`< :${uid}`, operator.value];
      case 'moreThanOrEqual':
        return [`>= :${uid}`, operator.value];
      case 'lessThanOrEqual':
        return [`<= :${uid}`, operator.value];
      case 'not':
        return [`!= :${uid}`, operator.value];
      case 'like':
        return [`LIKE :${uid}`, operator.value];
      case 'in':
        return [`IN (:...${uid})`, operator.value];
      case 'any':
        return [`ANY (:...${uid})`, operator.value];
      default:
        throw new TypeError('Unsupported FindOperator');
    }
  }

  private parseKey(key: string) {
    const property = this.camelToSnake(key);
    return key.includes('.') ? property : `${this.alias}.${property}`;
  }

  private camelToSnake(key: string) {
    return key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
  }
}
