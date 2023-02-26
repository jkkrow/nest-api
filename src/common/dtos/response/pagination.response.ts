import { Expose } from 'class-transformer';

export class PaginationResponse {
  @Expose()
  count: number | null;

  @Expose()
  token: string | null;
}
