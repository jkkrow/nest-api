import { Test } from '@nestjs/testing';
import { JwtModule as BaseJwtModule } from '@nestjs/jwt';

import { JwtService } from '../jwt.service';

describe('JwtService', () => {
  let jwtService: JwtService;

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
      providers: [JwtService],
    }).compile();

    jwtService = module.get(JwtService);
  });

  describe('sign', () => {
    it('should return a token', async () => {
      const token = jwtService.sign(
        { userId: 'id' },
        { sub: 'access', exp: '15m' },
      );

      expect(token).toBeDefined();
    });
  });

  describe('verify', () => {
    it('should return a payload', async () => {
      const token = jwtService.sign(
        { userId: 'id' },
        { sub: 'access', exp: '15m' },
      );
      const payload = jwtService.verify(token);

      expect(payload).toHaveProperty('userId');
      expect(payload).toHaveProperty('sub');
      expect(payload).toHaveProperty('iss');
      expect(payload).toHaveProperty('iat');
      expect(payload).toHaveProperty('exp');
    });

    it('should throw an exception with invalid subject', async () => {
      const refreshToken = jwtService.sign(
        { userId: 'id' },
        { sub: 'access', exp: '15m' },
      );

      const verify = () => jwtService.verify(refreshToken, { sub: 'refresh' });

      expect(verify).toThrow();
    });
  });
});
