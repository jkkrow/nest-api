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
  type?: JoinType;
};

export type OrderBy<T, K extends string> = {
  [key in keyof T]?: Direction;
} & {
  [key in Prefix<K>]: Direction;
};

export type Pagination = { max: number } & (Offset | Keyset);

export type Offset = {
  page: number;
  withCount?: boolean;
};

export type Keyset = {
  token?: string;
};

export type Prefix<K> = K extends string ? `${K}.${string}` : K;

export type Direction = 'ASC' | 'DESC';

export type Count = number | null;

export type Token = string | null;
