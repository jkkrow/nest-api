import { Test } from '@nestjs/testing';

import { EncryptService } from '../encrypt.service';

describe('EncryptService', () => {
  let encryptService: EncryptService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EncryptService],
    }).compile();

    encryptService = module.get(EncryptService);
  });

  describe('hash', () => {
    it('should return hashed string', async () => {
      const password = 'password';
      const hash = await encryptService.hash(password);

      expect(hash).not.toEqual(password);
    });
  });

  describe('verify', () => {
    it('should compare the password with hash', async () => {
      const password = 'password';
      const hash = await encryptService.hash(password);

      const verifyPromise = encryptService.verify(password, hash);

      await expect(verifyPromise).resolves.toEqual(undefined);
    });

    it('should throw an exception if password is not matched', async () => {
      const password = 'password';
      const hash = await encryptService.hash(password);

      const verifyPromise = encryptService.verify('wrongPassword', hash);

      await expect(verifyPromise).rejects.toThrow();
    });
  });
});
