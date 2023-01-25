import { Expose, Type } from 'class-transformer';

import { UserResponse } from './user.response';
import { GetSessionResponse } from './get-session.response';

export class SigninResponse extends GetSessionResponse {
  @Expose()
  @Type(() => UserResponse)
  user: UserResponse;
}
