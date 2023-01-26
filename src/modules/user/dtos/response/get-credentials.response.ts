import { Expose } from 'class-transformer';

export class GetCredentialsResponse {
  @Expose()
  accessToken: string;

  @Expose()
  refreshTokenExp: Date;
}
