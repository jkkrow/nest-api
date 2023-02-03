export type FindOptions<T, K extends string> = {
  where?: Where<T, K>;
  relation?: Relation<T, K>;
  search?: Search;
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
  // index: string | string[];
  type?: JoinType;
};

export type OrderBy<T, K extends string> = {
  [key in keyof T]?: 'ASC' | 'DESC';
} & {
  [key in Prefix<K>]: 'ASC' | 'DESC';
};

export type Pagination = Offset | Keyset;

export type Offset = {
  page: number;
  max: number;
};

export type Keyset = {
  token?: string;
  max: number;
};

export type Prefix<K> = K extends string ? `${K}.${string}` : K;
