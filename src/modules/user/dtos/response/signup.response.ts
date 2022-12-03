import { Expose } from 'class-transformer';

import { SigninResponse } from './signin.response';

export class SignupResponse extends SigninResponse {
  @Expose()
  message: string;
}
