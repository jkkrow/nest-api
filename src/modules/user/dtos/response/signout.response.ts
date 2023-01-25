import { Expose } from 'class-transformer';

export class SignoutResponse {
  @Expose()
  refreshToken: string;
}
