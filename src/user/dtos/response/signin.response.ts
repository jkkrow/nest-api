import { Expose, Type } from 'class-transformer';

import { UserResponse } from './user.response';

export class SigninResponse {
  @Expose()
  @Type(() => UserResponse)
  user: UserResponse;

  @Expose()
  refreshToken: string;

  @Expose()
  accessToken: string;
}
