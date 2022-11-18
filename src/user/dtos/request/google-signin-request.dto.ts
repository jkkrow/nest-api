import { IsString } from 'class-validator';

export class GoogleSigninRequestDto {
  @IsString()
  token: string;
}
