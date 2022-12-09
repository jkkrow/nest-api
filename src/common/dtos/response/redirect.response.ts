import { Expose } from 'class-transformer';

export class RedirectResponse {
  @Expose()
  url: string;
}
