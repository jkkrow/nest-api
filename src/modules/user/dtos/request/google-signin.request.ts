import { IsString } from 'class-validator';

export class GoogleSigninRequest {
  @IsString()
  token: string;
}
