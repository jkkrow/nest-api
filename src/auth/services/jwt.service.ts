import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as BaseJwtService } from '@nestjs/jwt';

import {
  JWTPayload,
  JWTSignOptions,
  JWTVerifyOptions,
} from '../interfaces/jwt.interface';

@Injectable()
export class JWTService {
  constructor(private readonly jwtService: BaseJwtService) {}

  sign(userId: string, options: JWTSignOptions) {
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

  verify(token: string, options?: JWTVerifyOptions) {
    try {
      const result = this.jwtService.verify<JWTPayload>(token, {
        subject: options?.sub,
        ignoreExpiration: options?.ignoreExp,
      });

      return result;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  signAuthToken(userId: string) {
    const refreshToken = this.sign(userId, { sub: 'refresh', exp: '7d' });
    const accessToken = this.sign(userId, { sub: 'access', exp: '15m' });

    return { refreshToken, accessToken };
  }
}
