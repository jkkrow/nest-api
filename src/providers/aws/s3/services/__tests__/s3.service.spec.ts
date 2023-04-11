import { Test, TestingModule } from '@nestjs/testing';
import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { ConfigService } from 'src/config/services/config.service';
import { S3Service } from '../s3.service';
import { UploadPart } from '../../interfaces/s3.interface';

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner');

const mockedS3Client = S3Client as jest.MockedClass<typeof S3Client>;
const mockedGetSignedUrl = getSignedUrl as jest.MockedFunction<
  typeof getSignedUrl
>;

describe('S3Service', () => {
  let service: S3Service;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'AWS_CONFIG_ACCESS_KEY_ID':
                  return 'test-access-key';
                case 'AWS_CONFIG_SECRET_ACCESS_KEY':
                  return 'test-secret-key';
                case 'AWS_S3_BUCKET':
                  return 'test-bucket';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize the S3 client with the correct configuration', () => {
    expect(mockedS3Client).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: 'test-access-key',
        secretAccessKey: 'test-secret-key',
      },
    });
    expect(configService.get).toHaveBeenCalledWith('AWS_CONFIG_ACCESS_KEY_ID');
    expect(configService.get).toHaveBeenCalledWith(
      'AWS_CONFIG_SECRET_ACCESS_KEY',
    );
    expect(configService.get).toHaveBeenCalledWith('AWS_S3_BUCKET');
  });

  describe('initiateMultipart', () => {
    it('should return the expected response from initiating a multipart upload', async () => {
      const sendMock = jest
        .fn()
        .mockResolvedValue({ UploadId: 'test-upload-id' });
      mockedS3Client.prototype.send = sendMock;

      const key = 'test-key';
      const fileType = 'video/mp4';
      const result = await service.initiateMultipart(key, fileType);

      expect(result).toEqual({ UploadId: 'test-upload-id' });
    });
  });

  describe('processMultipart', () => {
    it('should return the expected presigned URLs for the parts of a multipart upload', async () => {
      const key = 'test-key';
      const uploadId = 'test-upload-id';
      const partCount = 3;
      const presignedUrls = ['url1', 'url2', 'url3'];

      mockedGetSignedUrl
        .mockResolvedValueOnce(presignedUrls[0])
        .mockResolvedValueOnce(presignedUrls[1])
        .mockResolvedValueOnce(presignedUrls[2]);

      const result = await service.processMultipart(key, uploadId, partCount);

      expect(result).toEqual(presignedUrls);
    });
  });

  describe('completeMultipart', () => {
    it('should return the expected response when completing a multipart upload', async () => {
      const sendMock = jest.fn().mockResolvedValue({ Location: 'location' });
      mockedS3Client.prototype.send = sendMock;

      const key = 'test-key';
      const uploadId = 'test-upload-id';
      const parts: UploadPart[] = [
        { ETag: 'etag1', PartNumber: 1 },
        { ETag: 'etag2', PartNumber: 2 },
      ];
      const result = await service.completeMultipart(key, uploadId, parts);

      expect(result).toEqual({ Location: 'location' });
    });
  });

  describe('cancelMultipart', () => {
    it('should return the expected response when canceling a multipart upload', async () => {
      const sendMock = jest.fn().mockResolvedValue({});
      mockedS3Client.prototype.send = sendMock;

      const key = 'test-key';
      const uploadId = 'test-upload-id';
      const result = await service.cancelMultipart(key, uploadId);

      expect(result).toEqual({});
    });
  });

  describe('uploadObject', () => {
    it('should return the expected presigned URL for uploading an object', async () => {
      const key = 'test-key';
      const fileType = 'image/jpeg';
      const presignedUrl = 'url';

      mockedGetSignedUrl.mockResolvedValue(presignedUrl);

      const result = await service.uploadObject(key, fileType);

      expect(result).toEqual(presignedUrl);
    });
  });

  describe('deleteObject', () => {
    it('should return the expected response when deleting an object', async () => {
      const sendMock = jest.fn().mockResolvedValue({});
      mockedS3Client.prototype.send = sendMock;

      const key = 'test-key';
      const result = await service.deleteObject(key);

      expect(result).toEqual({});
    });
  });

  describe('deleteDirectory', () => {
    it('should return the expected response when deleting a directory', async () => {
      const sendMock = jest
        .fn()
        .mockResolvedValueOnce({ Contents: [], CommonPrefixes: [] })
        .mockResolvedValue({});

      mockedS3Client.prototype.send = sendMock;

      const key = 'test-key';
      const result = await service.deleteDirectory(key);

      expect(result).toEqual({});
    });
  });
});
