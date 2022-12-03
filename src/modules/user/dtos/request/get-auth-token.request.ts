import { IsString } from 'class-validator';

export class GetAuthTokenRequest {
  @IsString()
  refreshToken: string;
}
