import { Expose, Type } from 'class-transformer';

import { IUser } from '../../interfaces/user.interface';
import { UserType } from '../../constants/user.constant';
import { MembershipResponse } from './membership.response';

export class UserResponse implements Omit<IUser, 'password'> {
  @Expose()
  id: string;

  @Expose()
  type: UserType;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  picture: string;

  @Expose()
  verified: boolean;

  @Expose()
  admin: boolean;

  @Expose()
  @Type(() => MembershipResponse)
  membership: MembershipResponse | null;
}
