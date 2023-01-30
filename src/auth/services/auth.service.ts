import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import { UnauthorizedException } from 'src/common/exceptions';
import { CacheService } from 'src/providers/cache/services/cache.service';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
  ) {}

  async signCredentials(userId: string, groupId?: string) {
    const refreshToken = this.jwtService.sign(
      { userId, groupId },
      { sub: 'refresh', exp: '7d' },
    );
    const accessToken = this.jwtService.sign(
      { userId },
      { sub: 'access', exp: '15m' },
    );
    const refreshTokenExp = dayjs().add(7, 'day').toDate();

    const key = groupId || refreshToken;
    const activeRefreshToken = refreshToken;
    const ttl = dayjs(refreshTokenExp).diff(dayjs(), 'second');

    await this.cacheService.set(key, activeRefreshToken, ttl);

    return { refreshToken, accessToken, refreshTokenExp };
  }

  async rotateCredentials(refreshToken: string) {
    const { userId, groupId } = await this.verifyRefreshToken(refreshToken);
    const key = groupId || refreshToken;
    return this.signCredentials(userId, key);
  }

  async invalidateCredentials(refreshToken: string) {
    const { groupId } = await this.verifyRefreshToken(refreshToken);
    const key = groupId || refreshToken;
    await this.cacheService.del(key);
  }

  private async verifyRefreshToken(refreshToken: string) {
    const result = this.jwtService.verify<{ groupId: string }>(refreshToken, {
      sub: 'refresh',
      errorMessage: 'Invalid refresh token',
      ignoreExp: true,
    });

    const { groupId } = result;
    const key = groupId || refreshToken;
    const activeRefreshToken = await this.cacheService.get(key);

    if (!activeRefreshToken || activeRefreshToken !== refreshToken) {
      await this.cacheService.del(groupId);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return result;
  }
}
