import {
  SelectQueryBuilder as QueryBuilder,
  ObjectLiteral,
  FindOperator,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

import { Exception } from 'src/common/exceptions';
import { FindOptions, Offset, Keyset } from '../types/database.type';

export abstract class BaseRepository<
  T extends ObjectLiteral,
  K extends FindOptions<T, string>,
> {
  constructor(protected readonly alias: string) {}

  protected async getMany<D>(query: QueryBuilder<T>, options: K) {
    const { pagination } = options;
    const filteredQuery = this.filterQuery(query, options);
    const getDataPromise = filteredQuery.getMapMany<D>();

    if (pagination && this.isOffset(pagination)) {
      return Promise.all([getDataPromise, filteredQuery.getCount()]);
    }

    const result = await getDataPromise;
    let token: string | null = null;

    if (result.length) {
      const lastItem = result[result.length - 1] as any;
      token = this.generateKeysetToken(lastItem.$pagination);
    }

    return [result, token];
  }

  protected async getOne<D>(query: QueryBuilder<T>, options: K) {
    const filteredQuery = this.filterQuery(query, options);
    const result = await filteredQuery.getMapOne<D>();

    return result;
  }

  protected filterQuery(query: QueryBuilder<T>, options: K) {
    this.setWhere(query, options);
    this.setSearch(query, options);
    this.setRelation(query, options);
    this.setOrderBy(query, options);
    this.setPagination(query, options);

    return query;
  }

  private setWhere(query: QueryBuilder<T>, options: K) {
    const { where } = options;
    if (!where) return;
    Object.entries(where).forEach(([key, operator]) => {
      const property = this.formatKey(key);
      const uid = this.generateRandomKey();
      const [expression, value] = this.parseFindOperator(operator, uid);
      query.andWhere(`${property} ${expression}`, { [uid]: value });
    });
  }

  private setSearch(query: QueryBuilder<T>, options: K) {
    const { search } = options;
    if (!search) return;
    const uid = this.generateRandomKey();
    query.andWhere(`search @@ plainto_tsquery(:${uid})`, { [uid]: search });
    query.addOrderBy(`ts_rank(search, plainto_tsquery(:${uid}))`, 'DESC');
  }

  private setRelation(query: QueryBuilder<T>, options: K) {
    const { relation } = options;
    if (!relation) return;
    const { table, condition, type } = relation;
    const conditions = Object.entries(condition).map(([key, value]) => {
      const keyProp = this.formatKey(key);
      const valueProp = this.formatKey(value as string);
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

  private setOrderBy(query: QueryBuilder<T>, options: K) {
    const { orderBy } = options;
    if (!orderBy) return;
    Object.entries(orderBy).forEach(([key, value]) => {
      const property = this.formatKey(key);
      const isGrouped = query.getQuery().includes('GROUP BY');
      query.addOrderBy(property, value);
      isGrouped && query.addGroupBy(property);
    });
  }

  private setPagination(query: QueryBuilder<T>, options: K) {
    const { pagination, orderBy } = options;
    if (!pagination) return;
    if (this.isOffset(pagination)) {
      const { page, max } = pagination;
      query.limit(max);
      query.offset(max * (page - 1));
    }
    if (!this.isOffset(pagination)) {
      if (!orderBy) throw new Exception('OrderBy option must be provided');
      const { token, max } = pagination;
      query.limit(max);

      if (token) {
        const keyset = this.parseKeysetToken(token);
        const sortBy = Object.keys(orderBy).map((key) => this.formatKey(key));

        const entries = Object.entries(keyset);

        const sortedKeyset = Object.fromEntries(
          entries.sort((a, b) => sortBy.indexOf(a[0]) - sortBy.indexOf(b[0])),
        );

        const keys = Object.keys(sortedKeyset);
        const values = Object.values(sortedKeyset);
        const direction = Object.values(orderBy)[0];

        const params: Record<string, any> = {};
        const uids = values.map((value) => {
          const uid = this.generateRandomKey();
          params[uid] = value;
          return `:${uid}`;
        });

        const left = `(${keys.join(', ')})`;
        const right = `(${uids.join(', ')})`;
        const range = direction === 'DESC' ? '<' : '>';
        const condition = `${left} ${range} ${right}`;

        query.andWhere(condition, params);
      }

      Object.entries(orderBy).forEach(([key]) => {
        const property = this.formatKey(key);
        const column = this.toPaginationColumn(property);
        query.addSelect(column, `$pagination.${property}`);
      });
    }
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

  private formatKey(key: string) {
    const property = this.camelToSnake(key);
    return key.includes('.') ? property : `${this.alias}.${property}`;
  }

  private camelToSnake(key: string) {
    return key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
  }

  private isOffset(pagination: Offset | Keyset): pagination is Offset {
    return (pagination as Offset).page !== undefined;
  }

  private generateRandomKey() {
    return uuidv4().replace(/-/g, '');
  }

  private generateKeysetToken(keyset: Record<string, any>) {
    const secret = process.env.TOKEN_SECRET_KEY as string;
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes256', secret, iv);

    return (
      iv.toString('hex') +
      cipher.update(JSON.stringify(keyset), 'utf-8', 'hex') +
      cipher.final('hex')
    );
  }

  private parseKeysetToken(token: string) {
    const secret = process.env.TOKEN_SECRET_KEY as string;
    const iv = Buffer.from(token.slice(0, 32), 'hex');
    const encrypted = token.slice(32);

    const decipher = createDecipheriv('aes256', secret, iv);
    const update = decipher.update(encrypted, 'hex', 'utf-8');
    const final = decipher.final('utf-8');
    const decoded: Record<string, any> = JSON.parse(update + final);

    const keyset = Object.fromEntries(
      Object.entries(decoded).map(([key, value]) => [
        key,
        this.fromPaginationColumn(value),
      ]),
    );

    return keyset;
  }

  private toPaginationColumn(column: string) {
    return `'$pagination.' || ${column}`;
  }

  private fromPaginationColumn(column: string) {
    return column.split('$pagination.')[1];
  }
}
