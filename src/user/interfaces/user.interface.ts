export interface IUser {
  id: string;
  type: 'native' | 'google';
  name: string;
  email: string;
  password: string;
  picture: string;
  verified: boolean;
  admin: boolean;
  premium: IUserPremium | null;
  subscribers: string[];
}

export interface IUserPremium {
  id: string;
  name: 'standard' | 'business' | 'enterprise';
  expiredAt: Date;
  cancelled: boolean;
}
