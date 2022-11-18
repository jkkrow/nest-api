import { TokenSub, TokenExp } from '../constants/auth.constants';

export interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
  iss: string;
  sub: TokenSub;
}

export interface TokenSignOptions {
  sub: TokenSub;
  exp: TokenExp;
}

export interface TokenVerifyOptions {
  sub?: TokenSub;
  ignoreExp?: boolean;
}
