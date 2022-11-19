import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  TokenPayload,
  TokenSignOptions,
  TokenVerifyOptions,
} from '../interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  sign(userId: string, options: TokenSignOptions) {
    return this.jwtService.sign(
      {
        userId,
      },
      {
        expiresIn: options.exp,
        subject: options.sub,
      },
    );
  }

  verify(token: string, options?: TokenVerifyOptions) {
    try {
      const result = this.jwtService.verify<TokenPayload>(token, {
        subject: options?.sub,
        ignoreExpiration: options?.ignoreExp,
      });

      return result;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  signAuthTokens(userId: string) {
    const refreshToken = this.sign(userId, { sub: 'refresh', exp: '7d' });
    const accessToken = this.sign(userId, { sub: 'access', exp: '15m' });

    return { refreshToken, accessToken };
  }
}
