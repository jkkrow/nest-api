import { Test } from '@nestjs/testing';
import { MediaConvertClient } from '@aws-sdk/client-mediaconvert';

import { ConfigService } from 'src/config/services/config.service';
import { NotFoundException } from 'src/common/exceptions';
import { MediaConvertService } from '../media-convert.service';

jest.mock('@aws-sdk/client-mediaconvert');

describe('MediaConvertService', () => {
  let service: MediaConvertService;
  let mockedMediaConvertClient: jest.Mocked<typeof MediaConvertClient>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MediaConvertService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'AWS_CONFIG_ACCESS_KEY_ID':
                  return 'test-access-key-id';
                case 'AWS_CONFIG_SECRET_ACCESS_KEY':
                  return 'test-secret-access-key';
                case 'AWS_MEDIACONVERT_ENDPOINT':
                  return 'https://test.mediaconvert.endpoint';
                case 'APPLICATION_ID':
                  return 'test-application-id';
                case 'AWS_MEDIACONVERT_ROLE':
                  return 'test-role';
                case 'AWS_MEDIACONVERT_JOB_TEMPLATE':
                  return 'test-job-template';
                case 'AWS_MEDIACONVERT_EXT':
                  return 'mp4';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<MediaConvertService>(MediaConvertService);
    mockedMediaConvertClient = MediaConvertClient as jest.MockedClass<
      typeof MediaConvertClient
    >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createJob', () => {
    it('should throw an error if the job template is not found', async () => {
      const sendMock = jest.fn().mockResolvedValueOnce({ JobTemplate: null });
      mockedMediaConvertClient.prototype.send = sendMock;
      const key = 'source/videos/video.mp4';
      const bucket = 'test-bucket';

      await expect(service.createJob(key, bucket)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getJobTemplate', () => {
    it('should get the job template', async () => {
      const jobTemplateMock = { Settings: {} };
      const sendMock = jest
        .fn()
        .mockResolvedValueOnce({ JobTemplate: jobTemplateMock });
      mockedMediaConvertClient.prototype.send = sendMock;
      const result = await service['getJobTemplate']();

      expect(result).toEqual(jobTemplateMock);
    });

    it('should throw NotFoundException if the job template is not found', async () => {
      const sendMock = jest.fn().mockResolvedValueOnce({ JobTemplate: null });
      mockedMediaConvertClient.prototype.send = sendMock;

      await expect(service['getJobTemplate']()).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
