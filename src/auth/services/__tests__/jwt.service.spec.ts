import { Test } from '@nestjs/testing';
import { JwtModule as BaseJwtModule } from '@nestjs/jwt';

import { CacheService } from 'src/providers/cache/services/cache.service';
import { JwtService } from '../jwt.service';

describe('JwtService', () => {
  let jwtService: JwtService;
  let cacheService: CacheService;

  const fakeCacheService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        BaseJwtModule.registerAsync({
          useFactory: () => ({
            secret: 'secret',
            signOptions: { issuer: 'Test' },
            verifyOptions: { issuer: 'Test' },
          }),
        }),
      ],
      providers: [
        JwtService,
        { provide: CacheService, useValue: fakeCacheService },
      ],
    }).compile();

    jwtService = module.get(JwtService);
    cacheService = module.get(CacheService);
  });

  describe('sign', () => {
    it('should return a token', async () => {
      const token = jwtService.sign('id', { sub: 'access', exp: '15m' });

      expect(token).toBeDefined();
    });
  });

  describe('verify', () => {
    it('should return a payload', async () => {
      const token = jwtService.sign('id', { sub: 'access', exp: '15m' });
      const payload = jwtService.verify(token);

      expect(payload).toHaveProperty('userId');
      expect(payload).toHaveProperty('sub');
      expect(payload).toHaveProperty('iss');
      expect(payload).toHaveProperty('iat');
      expect(payload).toHaveProperty('exp');
    });

    it('should throw an exception with invalid subject', async () => {
      const refreshToken = jwtService.sign('id', { sub: 'access', exp: '15m' });

      const verify = () => jwtService.verify(refreshToken, { sub: 'refresh' });

      expect(verify).toThrow();
    });
  });

  describe('invalidateRefreshToken', () => {
    it('should save refresh token in cache storage', async () => {
      const refreshToken = jwtService.sign('id', { sub: 'refresh', exp: '7d' });
      const set = jest.spyOn(cacheService, 'set');

      const exp = Date.now() + 60;
      await jwtService.invalidateRefreshToken(refreshToken, null, exp);

      expect(set).toBeCalled();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should return payload if not invalidated', async () => {
      const refreshToken = jwtService.sign('id', { sub: 'refresh', exp: '7d' });

      const result = await jwtService.verifyRefreshToken(refreshToken);

      expect(result).toHaveProperty('userId');
    });

    it('should throw an exception if invalidated', async () => {
      const refreshToken = jwtService.sign('id', { sub: 'refresh', exp: '7d' });
      const get = jest.spyOn(cacheService, 'get');
      get.mockResolvedValueOnce({ next: null });

      const verifyPromise = jwtService.verifyRefreshToken(refreshToken);

      await expect(verifyPromise).rejects.toThrow();
    });
  });

  describe('rotateRefreshToken', () => {
    it('should return new set of tokens', async () => {
      const refreshToken = jwtService.sign('id', { sub: 'refresh', exp: '7d' });

      const result = await jwtService.rotateRefreshToken(refreshToken);

      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('accessToken');
    });

    it('should throw an exception if invalid refresh token', async () => {
      const refreshToken = 'invalidToken';

      const rotatePromise = jwtService.rotateRefreshToken(refreshToken);

      await expect(rotatePromise).rejects.toThrow();
    });
  });
});
