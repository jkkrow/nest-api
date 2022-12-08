import { Optional } from 'utility-types';

import { UserType, MembershipName } from '../constants/user.constant';

export interface IUser {
  id: string;
  type: UserType;
  name: string;
  email: string;
  password: string;
  picture: string;
  verified: boolean;
  admin: boolean;
  membership: IMembership | null;
}

export interface IMembership {
  id: string;
  name: MembershipName;
  expiredAt: Date;
  cancelled: boolean;
}

export type CreateUserParams = Optional<
  IUser,
  'picture' | 'verified' | 'admin' | 'membership'
>;
