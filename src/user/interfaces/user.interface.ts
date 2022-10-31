export interface IUser {
  _id: string;
  type: string;
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
  name: 'Standard' | 'Business' | 'Enterprise';
  expiredAt: Date;
  cancelled: boolean;
}
