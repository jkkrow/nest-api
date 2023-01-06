import { Test } from '@nestjs/testing';

import { ConfigService } from 'src/config/services/config.service';
import { S3Service } from '../s3.service';

jest.mock('aws-sdk', () => {
  const mockPromise = (value: any) => {
    return jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue(value),
    });
  };

  return {
    S3: jest.fn(() => ({
      createMultipartUpload: mockPromise({}),
      completeMultipartUpload: mockPromise({}),
      abortMultipartUpload: mockPromise({}),
      deleteObject: mockPromise({}),
      deleteObjects: mockPromise({}),
      listObjectsV2: mockPromise({
        Contents: [{ Key: 'test.jpg' }],
        Prefix: '',
      }),
      getSignedUrlPromise: jest.fn(),
    })),
  };
});

describe('S3Service', () => {
  let s3Service: S3Service;

  const fakeConfigService = {
    get: jest.fn().mockReturnValue('mock'),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        S3Service,
        { provide: ConfigService, useValue: fakeConfigService },
      ],
    }).compile();

    s3Service = module.get(S3Service);
  });

  describe('generateVideoKey', () => {
    const userId = 'userId';
    const videoId = 'videoId';
    const fileName = 'fileName';

    it('should include a source prefix', async () => {
      const key = s3Service.generateVideoKey(userId, videoId, fileName);

      expect(key.split('/')).toContain('source');
    });

    it('should include userId and videoId', async () => {
      const key = s3Service.generateVideoKey(userId, videoId, fileName);

      expect(key.split('/')[1]).toEqual(userId);
      expect(key.split('/')[2]).toEqual(videoId);
    });
  });

  describe('generateImageKey', () => {
    const userId = 'userId';
    const fileType = 'image/jpg';

    it('should include userId', async () => {
      const key = s3Service.generateImageKey(userId, fileType);

      expect(key.split('/')[1]).toEqual(userId);
    });
  });

  describe('deleteDirectory', () => {
    it('should collect all prefixes from key', async () => {
      const getDirectoryPrefixes = jest.spyOn(
        s3Service as any,
        'getDirectoryPrefixes',
      );

      const key = 'videos/1234/asdf/test.mp4';
      await s3Service.deleteDirectory(key);

      const prefixes = await getDirectoryPrefixes.mock.results[0].value;

      expect(prefixes.length).toBeGreaterThanOrEqual(1);
    });
  });
});
