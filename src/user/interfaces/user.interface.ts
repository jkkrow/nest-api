export interface IUser {
  id: string;
  type: 'native' | 'google';
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
  name: 'standard' | 'business' | 'enterprise';
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
