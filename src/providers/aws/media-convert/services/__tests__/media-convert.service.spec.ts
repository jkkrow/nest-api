import { Test } from '@nestjs/testing';

import { ConfigService } from 'src/config/services/config.service';
import { MediaConvertService } from '../media-convert.service';

jest.mock('aws-sdk', () => {
  const mockPromise = (value: any) => {
    return jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue(value),
    });
  };

  return {
    MediaConvert: jest.fn(() => ({
      createJob: mockPromise({}),
      getJobTemplate: mockPromise({
        JobTemplate: {
          Settings: {
            Inputs: [{}],
            OutputGroups: [
              {
                OutputGroupSettings: {
                  Type: 'CMAF_GROUP_SETTINGS',
                  CmafGroupSettings: {},
                },
              },
              {
                OutputGroupSettings: {
                  Type: 'FILE_GROUP_SETTINGS',
                  FileGroupSettings: {},
                },
              },
            ],
          },
        },
      }),
    })),
  };
});

describe('MediaConvertService', () => {
  let service: MediaConvertService;

  const fakeConfigService = {
    get: jest.fn().mockReturnValue('mock'),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MediaConvertService,
        { provide: ConfigService, useValue: fakeConfigService },
      ],
    }).compile();

    service = module.get(MediaConvertService);
  });

  describe('createJob', () => {
    const key = 'videos/1234/asdf/source/test.mp4';
    const bucket = 'test-bucket';

    it('should find a job template', async () => {
      const getJobTemplate = jest.spyOn(service as any, 'getJobTemplate');

      await service.createJob(key, bucket);

      const template = await getJobTemplate.mock.results[0].value;
      expect(template).toHaveProperty('Settings');
    });

    it('should create settings including user metadata', async () => {
      const createSettings = jest.spyOn(service as any, 'createSettings');

      await service.createJob(key, bucket);

      const { metadata } = createSettings.mock.results[0].value;
      expect(metadata.userId).toEqual(key.split('/')[1]);
      expect(metadata.videoId).toEqual(key.split('/')[2]);
    });

    it('should update settings', async () => {
      const createSettings = jest.spyOn(service as any, 'createSettings');
      const updateJobTemplate = jest.spyOn(service as any, 'updateJobTemplate');

      await service.createJob(key, bucket);

      const { inputPath } = createSettings.mock.results[0].value;
      const jobTemplate = updateJobTemplate.mock.results[0].value;

      expect(jobTemplate.Settings.Inputs[0].FileInput).toEqual(inputPath);
    });
  });
});
