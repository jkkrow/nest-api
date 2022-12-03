import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  get<T = any>(key: string) {
    return this.cacheManager.get<T>(key);
  }

  set<T = any>(key: string, value: T, ttl: number) {
    return this.cacheManager.set(key, value, { ttl } as any);
  }

  del(key: string) {
    return this.cacheManager.del(key);
  }
}
