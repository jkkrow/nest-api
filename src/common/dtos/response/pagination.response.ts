import { Expose } from 'class-transformer';

export class OffsetPaginationResponse {
  @Expose()
  count: number;
}

export class KeysetPaginationResponse {
  @Expose()
  token: string | null;
}
