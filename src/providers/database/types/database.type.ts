export type FindOptions<T, K extends string> = {
  where?: Where<T, K>;
  relation?: Relation<T, K>;
  groupBy?: GroupBy<T, K>;
  orderBy?: OrderBy<T, K>;
  pagination?: Pagination;
};

type Where<T, K extends string> = {
  [key in keyof T]?: any;
} & {
  [key in Prefix<K>]: any;
};

type JoinCondition<T, K extends string> = {
  [key in keyof T]?: keyof T | Prefix<K>;
} & {
  [key in Prefix<K>]: keyof T | Prefix<K>;
};

type JoinType = 'INNER' | 'LEFT';

type Relation<T, K extends string> = {
  table: K;
  condition: JoinCondition<T, K>;
  type?: JoinType;
};

type GroupBy<T, K extends string> = {
  [key in keyof T]?: boolean;
} & {
  [key in Prefix<K>]: boolean;
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

type Prefix<K> = K extends string ? `${K}.${string}` : K;
