import { Expose, Type } from 'class-transformer';

import { UserResponse } from './user.response';
import { GetCredentialsResponse } from './get-credentials.response';

export class SigninResponse extends GetCredentialsResponse {
  @Expose()
  @Type(() => UserResponse)
  user: UserResponse;
}
