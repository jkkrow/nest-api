import { UserType, MembershipName } from '../constants/user.constant';

export interface User {
  id: string;
  type: UserType;
  name: string;
  email: string;
  password: string;
  picture: string;
  verified: boolean;
  admin: boolean;
  membership: Membership | null;
}

export interface Membership {
  id: string;
  name: MembershipName;
  expiredAt: Date;
  cancelled: boolean;
}

export interface CreateUserParams extends Partial<User> {
  id: string;
  type: UserType;
  name: string;
  email: string;
  password: string;
}
