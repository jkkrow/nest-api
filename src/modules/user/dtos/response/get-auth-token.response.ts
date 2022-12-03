import { Expose } from 'class-transformer';

export class GetAuthTokenResponse {
  @Expose()
  refreshToken: string;

  @Expose()
  accessToken: string;
}
