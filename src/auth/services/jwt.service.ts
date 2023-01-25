import { Injectable } from '@nestjs/common';
import { JwtService as BaseJwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';

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

  private errorMessage = 'Invalid or expired token';

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
    const { sub, ignoreExp, errorMessage } = options || {};
    try {
      const result = this.jwtService.verify<JwtPayload>(token, {
        subject: sub,
        ignoreExpiration: ignoreExp,
      });

      return result;
    } catch (err) {
      throw new UnauthorizedException(errorMessage || this.errorMessage);
    }
  }

  signAuthToken(userId: string) {
    const refreshToken = this.sign(userId, { sub: 'refresh', exp: '7d' });
    const accessToken = this.sign(userId, { sub: 'access', exp: '15m' });
    const lastSignedIn = dayjs().toDate();
    const sessionExpiresIn = dayjs().add(7, 'day').toDate();

    return { refreshToken, accessToken, lastSignedIn, sessionExpiresIn };
  }

  async rotateRefreshToken(refreshToken: string) {
    // Verify refresh token
    const { userId, exp } = await this.verifyRefreshToken(refreshToken);

    // Sign new auth token
    const result = this.signAuthToken(userId);

    // Invalidate previous refresh token
    const next = result.refreshToken;
    await this.invalidateRefreshToken(refreshToken, next, exp);

    return { userId, ...result };
  }

  private async verifyRefreshToken(refreshToken: string) {
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

    throw new UnauthorizedException(this.errorMessage);
  }

  private async invalidateRefreshToken(
    refreshToken: string,
    next: string | null,
    exp: number,
  ) {
    const ttl = exp - dayjs().unix();
    await this.cacheService.set<JwtInvalidation>(refreshToken, { next }, ttl);
  }
}
