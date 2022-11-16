import { Expose, Type } from 'class-transformer';

import { IUser, IUserPremium } from '../interfaces/user.interface';

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
  @Type(() => PremiumDto)
  premium: IUserPremium;
}

class PremiumDto implements IUserPremium {
  @Expose()
  id: string;

  @Expose()
  name: IUserPremium['name'];

  @Expose()
  expiredAt: Date;

  @Expose()
  cancelled: boolean;
}
