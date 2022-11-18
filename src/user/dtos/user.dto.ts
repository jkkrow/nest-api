import { Expose, Type } from 'class-transformer';

import { IUser, IMembership } from '../interfaces/user.interface';
import { MembershipName, UserType } from '../constants/user.constant';

export class UserDto implements Omit<IUser, 'password'> {
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
  @Type(() => MembershipDto)
  membership: IMembership | null;
}

class MembershipDto implements IMembership {
  @Expose()
  id: string;

  @Expose()
  name: MembershipName;

  @Expose()
  expiredAt: Date;

  @Expose()
  cancelled: boolean;
}
