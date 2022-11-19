import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  get(key: string) {
    return this.cacheManager.get<string>(key);
  }

  set(key: string, value: any, ttl?: number) {
    return this.cacheManager.set(key, value, { ttl } as any);
  }

  del(key: string) {
    return this.cacheManager.del(key);
  }
}
