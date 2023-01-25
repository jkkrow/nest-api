import { JwtSub, JwtExp } from '../constants/jwt.constants';

export interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
  iss: string;
  sub: JwtSub;
}

export interface JwtSignOptions {
  sub: JwtSub;
  exp: JwtExp;
}

export interface JwtVerifyOptions {
  sub?: JwtSub;
  ignoreExp?: boolean;
  errorMessage?: string;
}

export interface JwtInvalidation {
  next: string | null;
}
