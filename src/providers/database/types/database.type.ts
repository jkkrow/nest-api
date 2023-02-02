export type FindOptions<T, K extends string> = {
  where?: Where<T, K>;
  relation?: Relation<T, K>;
  search?: Search;
  groupBy?: GroupBy<T, K>;
  orderBy?: OrderBy<T, K>;
  pagination?: Pagination;
};

export type Where<T, K extends string> = {
  [key in keyof T]?: any;
} & {
  [key in Prefix<K>]: any;
};

export type Search = string;

export type JoinCondition<T, K extends string> = {
  [key in keyof T]?: keyof T | Prefix<K>;
} & {
  [key in Prefix<K>]: keyof T | Prefix<K>;
};

export type JoinType = 'INNER' | 'LEFT';

export type Relation<T, K extends string> = {
  table: K;
  condition: JoinCondition<T, K>;
  type?: JoinType;
};

export type GroupBy<T, K extends string> = {
  [key in keyof T]?: boolean;
} & {
  [key in Prefix<K>]: boolean;
};

export type OrderBy<T, K extends string> = {
  [key in keyof T]?: 'ASC' | 'DESC';
} & {
  [key in Prefix<K>]: 'ASC' | 'DESC';
};

export type Pagination = Offset | Cursor;

export type Offset = {
  page: number;
  max: number;
};

export type Cursor = {
  key: string;
  direction: 'ASC' | 'DESC';
  max: number;
};

export type Prefix<K> = K extends string ? `${K}.${string}` : K;
