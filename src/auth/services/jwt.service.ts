import { Injectable } from '@nestjs/common';
import { JwtService as BaseJwtService } from '@nestjs/jwt';

import { UnauthorizedException } from 'src/common/exceptions';
import { CacheService } from 'src/providers/cache/services/cache.service';
import {
  JwtPayload,
  JwtSignOptions,
  JwtVerifyOptions,
  JwtInvalidation,
} from '../interfaces/jwt.interface';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: BaseJwtService,
    private readonly cacheService: CacheService,
  ) {}

  sign(userId: string, options: JwtSignOptions) {
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

  verify(token: string, options?: JwtVerifyOptions) {
    try {
      const result = this.jwtService.verify<JwtPayload>(token, {
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
    const accessToken = this.sign(userId, { sub: 'access', exp: '7d' });

    return { refreshToken, accessToken };
  }

  async invalidateRefreshToken(
    refreshToken: string,
    next: string | null,
    exp: number,
  ) {
    const ttl = exp - Math.round(new Date().getTime() / 1000);
    await this.cacheService.set<JwtInvalidation>(refreshToken, { next }, ttl);
  }

  async rotateRefreshToken(refreshToken: string) {
    // Verify refresh token
    const { userId, exp } = await this.verifyRefreshToken(refreshToken);

    // Sign new auth token
    const token = this.signAuthToken(userId);

    // Invalidate previous refresh token
    const next = token.refreshToken;
    await this.invalidateRefreshToken(refreshToken, next, exp);

    return token;
  }

  async verifyRefreshToken(refreshToken: string) {
    // Check if it's expired
    const result = this.verify(refreshToken, { sub: 'refresh' });

    // Check if it's invalidated
    const invalidatedToken = await this.cacheService.get<JwtInvalidation>(
      refreshToken,
    );

    // If not invalidated, return payload
    if (!invalidatedToken) {
      return result;
    }

    // If invalidated, also invalidate active token from this family
    let currentToken = invalidatedToken.next;

    while (currentToken) {
      const result = await this.cacheService.get<JwtInvalidation>(currentToken);

      if (!result) {
        const { exp } = this.verify(currentToken, { sub: 'refresh' });
        await this.invalidateRefreshToken(currentToken, null, exp);
        break;
      }

      currentToken = result.next;
    }

    throw new UnauthorizedException('Invalid or expired token');
  }
}
