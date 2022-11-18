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

export interface ICreateUserParams {
  id: IUser['id'];
  type: IUser['type'];
  name: IUser['name'];
  email: IUser['email'];
  password: IUser['password'];
  picture?: IUser['picture'];
  verified?: IUser['verified'];
  admin?: IUser['admin'];
  membership?: IUser['membership'];
}
