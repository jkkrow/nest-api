import { Expose } from 'class-transformer';

export class GetAuthTokenResponseDto {
  @Expose()
  refreshToken: string;

  @Expose()
  accessToken: string;
}
