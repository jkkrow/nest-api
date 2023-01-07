import { Test } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/common';

import { CacheService } from '../cache.service';

describe('CacheService', () => {
  let cacheService: CacheService;

  const fakeCacheManager = {
    get: jest.fn().mockResolvedValue({}),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CacheService,
        { provide: CACHE_MANAGER, useValue: fakeCacheManager },
      ],
    }).compile();

    cacheService = module.get(CacheService);
  });

  describe('get', () => {
    it('should return a stored value', async () => {
      const result = await cacheService.get('key');

      expect(result).toBeDefined();
    });
  });

  describe('set', () => {
    it('should return void', async () => {
      const result = await cacheService.set('key', 'value', 10);

      expect(result).toBeUndefined();
    });
  });

  describe('del', () => {
    it('should return void', async () => {
      const result = await cacheService.del('key');

      expect(result).toBeUndefined();
    });
  });
});
