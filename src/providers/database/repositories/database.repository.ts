import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

type Prefix<K> = K extends string ? `${K}.${string}` : K;

type Where<T, K extends string> = {
  [key in keyof T]?: any;
} & {
  [key in Prefix<K>]: any;
};

type OrderBy<T, K extends string> = {
  [key in keyof T]?: 'ASC' | 'DESC';
} & {
  [key in Prefix<K>]: 'ASC' | 'DESC';
};

type Pagination = {
  page: number;
  max: number;
};

export type FindOptions<T, K extends string> = {
  where?: Where<T, K>;
  orderBy?: OrderBy<T, K>;
  pagination?: Pagination;
};

export abstract class BaseRepository<
  T extends ObjectLiteral,
  K extends FindOptions<T, string>,
> {
  constructor(protected readonly alias: string) {
    this.alias = alias;
  }

  protected filterQuery(query: SelectQueryBuilder<T>, options: K) {
    const { where, orderBy, pagination } = options;

    if (where) {
      Object.entries(where).forEach(([key, value]) => {
        const property = this.parseKey(key);
        const uid = uuidv4().replace(/-/g, '');

        query.andWhere(`${property} = :${uid}`, { [uid]: value });
        query.setParameter(uid, value);
      });
    }

    if (orderBy) {
      Object.entries(orderBy).forEach(([key, value]) => {
        const property = this.parseKey(key);
        query.addOrderBy(property, value);
        query.addGroupBy(property);
      });
    }

    if (pagination) {
      const { page, max } = pagination;
      query.limit(max);
      query.offset(max * (page - 1));
    }

    return query;
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
