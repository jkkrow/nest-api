export interface IUser {
  id: string;
  type: 'native' | 'google';
  name: string;
  email: string;
  password: string;
  picture: string;
  verified: boolean;
  admin: boolean;
  premium: IUserPremium;
}

export interface IUserPremium {
  id: string | null;
  name: 'standard' | 'business' | 'enterprise' | null;
  expiredAt: Date | null;
  cancelled: boolean | null;
}
