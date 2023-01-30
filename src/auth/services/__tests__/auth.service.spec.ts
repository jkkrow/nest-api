import { Test } from '@nestjs/testing';

import { CacheService } from 'src/providers/cache/services/cache.service';
import { AuthService } from '../auth.service';
import { JwtService } from '../jwt.service';

describe('AuthService', () => {
  let authService: AuthService;
  let cacheService: CacheService;

  const fakeJwtService = {
    sign: jest.fn().mockReturnValue('token'),
    verify: jest.fn().mockResolvedValue({ userId: 'id' }),
  };

  const fakeCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: fakeJwtService },
        { provide: CacheService, useValue: fakeCacheService },
      ],
    }).compile();

    authService = module.get(AuthService);
    cacheService = module.get(CacheService);
  });

  describe('signCredentials', () => {
    it('should return tokens and exp', async () => {
      const credentials = await authService.signCredentials('id');

      expect(credentials).toHaveProperty('accessToken');
      expect(credentials).toHaveProperty('refreshToken');
      expect(credentials).toHaveProperty('refreshTokenExp');
    });

    it('should persist refresh token in cache storage', async () => {
      const set = jest.spyOn(cacheService, 'set');

      await authService.signCredentials('id');

      expect(set).toBeCalled();
    });
  });

  describe('rotateRefreshToken', () => {
    it('should return new set of tokens', async () => {
      const { refreshToken } = await authService.signCredentials('id');
      const get = jest.spyOn(cacheService, 'get');
      get.mockResolvedValueOnce(refreshToken);

      const credentials = await authService.rotateCredentials(refreshToken);

      expect(credentials).toHaveProperty('refreshToken');
      expect(credentials).toHaveProperty('accessToken');
      expect(credentials).toHaveProperty('refreshTokenExp');
    });

    it('should throw an exception if invalid refresh token', async () => {
      const refreshToken = 'invalidToken';

      const rotatePromise = authService.rotateCredentials(refreshToken);

      await expect(rotatePromise).rejects.toThrow();
    });
  });

  describe('invalidateRefreshToken', () => {
    it('should delete refresh token from cache storage', async () => {
      const { refreshToken } = await authService.signCredentials('id');
      const get = jest.spyOn(cacheService, 'get');
      const del = jest.spyOn(cacheService, 'del');
      get.mockResolvedValueOnce(refreshToken);

      await authService.invalidateCredentials(refreshToken);

      expect(del).toBeCalled();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should return payload if not invalidated', async () => {
      const { refreshToken } = await authService.signCredentials('id');
      const get = jest.spyOn(cacheService, 'get');
      get.mockResolvedValueOnce(refreshToken);

      const result = await authService['verifyRefreshToken'](refreshToken);

      expect(result).toHaveProperty('userId');
    });

    it('should throw an exception if invalidated', async () => {
      const { refreshToken } = await authService.signCredentials('id');
      const get = jest.spyOn(cacheService, 'get');
      get.mockResolvedValueOnce(undefined);

      const verifyPromise = authService['verifyRefreshToken'](refreshToken);

      await expect(verifyPromise).rejects.toThrow();
    });
  });
});
