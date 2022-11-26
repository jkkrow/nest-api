import { Expose, Type } from 'class-transformer';

import { UserResponse } from './user.response';

export class GetUserResponse {
  @Expose()
  @Type(() => UserResponse)
  user: UserResponse;
}
