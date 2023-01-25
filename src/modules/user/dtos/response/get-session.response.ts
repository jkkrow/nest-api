import { Expose } from 'class-transformer';

export class GetSessionResponse {
  @Expose()
  refreshToken: string;

  @Expose()
  accessToken: string;

  @Expose()
  lastSignedIn: Date;

  @Expose()
  sessionExpiresIn: Date;
}
