import { Expose, Type } from 'class-transformer';

import { IUser, IMembership } from '../interfaces/user.interface';

export class UserDto implements Partial<IUser> {
  @Expose()
  id: string;

  @Expose()
  type: IUser['type'];

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
  name: IMembership['name'];

  @Expose()
  expiredAt: Date;

  @Expose()
  cancelled: boolean;
}
