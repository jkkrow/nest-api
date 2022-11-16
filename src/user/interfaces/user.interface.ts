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
