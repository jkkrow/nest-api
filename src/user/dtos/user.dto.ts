import { Expose, Transform } from 'class-transformer';

import { IUserPremium } from '../interfaces/user.interface';

export class UserDto {
  @Expose()
  _id: string;

  @Expose()
  type: string;

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
  premium: IUserPremium | null;

  @Transform(({ value }) => value.length)
  subscribers: number;
}
