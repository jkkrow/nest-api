import { JWTSub, JWTExp } from '../constants/jwt.constants';

export interface JWTPayload {
  userId: string;
  iat: number;
  exp: number;
  iss: string;
  sub: JWTSub;
}

export interface JWTSignOptions {
  sub: JWTSub;
  exp: JWTExp;
}

export interface JWTVerifyOptions {
  sub?: JWTSub;
  ignoreExp?: boolean;
}
