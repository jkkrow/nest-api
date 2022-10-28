export interface IUser {
  name: string;
  email: string;
  password: string;
  picture: string;
  verified: boolean;
  admin: boolean;
  premium: IUserPremium | null;
  subscribers: string[]; // ref to User Document
}

export interface IUserPremium {
  id: string;
  name: 'Standard' | 'Business' | 'Enterprise';
  expiredAt: Date;
  cancelled: boolean;
}
