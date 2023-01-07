import { Test } from '@nestjs/testing';

import { ConfigService } from 'src/config/services/config.service';
import { OAuthService } from '../oauth.service';

jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn(() => ({
    verifyIdToken: jest.fn(() => ({
      getPayload: jest.fn(() => ({
        email_verified: true,
        name: 'Test',
        email: 'test@example.com',
        picture: 'test.jpg',
      })),
    })),
  })),
}));

describe('OAuthService', () => {
  let oAuthService: OAuthService;

  const fakeConfigService = {
    get: jest.fn().mockReturnValue('mock'),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OAuthService,
        { provide: ConfigService, useValue: fakeConfigService },
      ],
    }).compile();

    oAuthService = module.get(OAuthService);
  });

  describe('verifyToken', () => {
    it('should return email, name, and picture', async () => {
      const result = await oAuthService.verifyToken('token');

      expect(result.email).toBeDefined();
      expect(result.name).toBeDefined();
      expect(result.picture).toBeDefined();
    });

    it('should be failed if email is invalid', async () => {
      const verifyIdToken = jest.spyOn(oAuthService['client'], 'verifyIdToken');
      verifyIdToken.mockImplementationOnce(() => ({
        getPayload: jest.fn(() => ({
          email_verified: false,
          name: 'Test',
          email: 'test@example.com',
          picture: 'test.jpg',
        })),
      }));

      const verifyPromise = oAuthService.verifyToken('token');

      await expect(verifyPromise).rejects.toThrow();
    });
  });
});
