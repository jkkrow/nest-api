import { Expose } from 'class-transformer';

import { SigninResponseDto } from './signin-response.dto';

export class SignupResponseDto extends SigninResponseDto {
  @Expose()
  message: string;
}
