import { CacheModule as BaseCacheModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { redisStore } from 'cache-manager-redis-store';

import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/services/config.service';
import { CacheService } from '../cache.service';

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        BaseCacheModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (config: ConfigService) => {
            const store = await redisStore({
              socket: {
                host: config.get('REDIS_HOST'),
                port: config.get('REDIS_PORT'),
              },
              username: config.get('REDIS_USERNAME'),
              password: config.get('REDIS_PASSWORD'),
            });

            return { store: () => store } as unknown;
          },
        }),
      ],
      providers: [CacheService],
    }).compile();

    cacheService = module.get(CacheService);
  });

  describe('get', () => {
    it('should return a stored value', async () => {
      const key = 'key';
      const result = await cacheService.get(key);

      expect(result).toBeDefined();
    });
  });

  describe('set', () => {
    it('should save value to store', async () => {
      const key = 'key';
      const value = 'value';

      const response = await cacheService.set(key, value, 10);
      const result = await cacheService.get(key);

      expect(response).not.toBeFalsy();
      expect(result).toEqual(value);
    });
  });

  describe('del', () => {
    it('should remove value from store', async () => {
      const key = 'key';
      const value = 'value';
      await cacheService.set(key, value, 10);

      const response = await cacheService.del(key);
      const result = await cacheService.get(key);

      expect(response).not.toBeFalsy();
      expect(result).toBeNull();
    });
  });
});
