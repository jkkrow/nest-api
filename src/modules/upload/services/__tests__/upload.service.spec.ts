import { parse } from 'path';

import {
  BadRequestException,
  UnauthorizedException,
} from 'src/common/exceptions';
import { UploadService } from '../upload.service';

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(() => {
    service = new UploadService();
  });

  describe('generateVideoKey', () => {
    it('should generate a valid video key', () => {
      const userId = 'user1';
      const videoId = 'video1';
      const fileName = 'test.mp4';

      const key = service.generateVideoKey(userId, videoId, fileName);

      expect(key).toEqual(`videos/${userId}/${videoId}/source/${fileName}`);
    });

    it('should correctly encode the fileName with special characters', () => {
      const userId = 'user1';
      const videoId = 'video1';
      const fileName = 'some file with spaces.mp4';
      const encodedFileName = encodeURIComponent(fileName);

      const generatedKey = service.generateVideoKey(userId, videoId, fileName);

      expect(generatedKey).toEqual(
        `videos/${userId}/${videoId}/source/${encodedFileName}`,
      );
      expect(generatedKey).not.toEqual(
        `videos/${userId}/${videoId}/source/${fileName}`,
      );
    });
  });

  describe('generateImageKey', () => {
    it('should generate a valid image key with the correct file extension', () => {
      const userId = 'user1';
      const fileType = 'image/jpeg';

      const key = service.generateImageKey(userId, fileType);
      const ext = fileType.split('/')[1];

      expect(key.startsWith(`images/${userId}/`)).toBe(true);
      expect(key.endsWith(`.${ext}`)).toBe(true);
    });
  });

  describe('verifyFileKey', () => {
    it('should return true for a local key with the correct user id', () => {
      const userId = 'user1';
      const key = `videos/${userId}/some-video/source/some-file.mp4`;

      expect(service.verifyFileKey(key, userId)).toBe(true);
    });

    it('should throw an UnauthorizedException for a local key with the incorrect user id', () => {
      const userId = 'user1';
      const key = `videos/some-other-user/some-video/source/some-file.mp4`;

      expect(() => service.verifyFileKey(key, userId)).toThrow(
        UnauthorizedException,
      );
    });

    it('should return false for a non-local key', () => {
      const userId = 'user1';
      const key = `http://example.com/videos/${userId}/some-video/source/some-file.mp4`;

      expect(service.verifyFileKey(key, userId)).toBe(false);
    });
  });

  describe('verifyImageFileType', () => {
    it('should not throw an error for a valid image file type', () => {
      const fileType = 'image/jpeg';

      expect(() => service.verifyImageFileType(fileType)).not.toThrow();
    });

    it('should throw a BadRequestException for an invalid image file type', () => {
      const fileType = 'video/mp4';

      expect(() => service.verifyImageFileType(fileType)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('verifyVideoFileType', () => {
    it('should not throw an error for a valid video file type', () => {
      const fileType = 'video/mp4';

      expect(() => service.verifyVideoFileType(fileType)).not.toThrow();
    });

    it('should throw a BadRequestException for an invalid video file type', () => {
      const fileType = 'image/jpeg';

      expect(() => service.verifyVideoFileType(fileType)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('parseKey', () => {
    it('should parse a key and return the correct user id and extension', () => {
      const userId = 'user1';
      const key = `videos/${userId}/some-video/source/some-file.mp4`;
      const { ext } = parse(key);

      const result = service.parseKey(key);

      expect(result.userId).toEqual(userId);
      expect(result.ext).toEqual(ext);
    });
  });

  describe('parseVideoKey', () => {
    it('should parse a video key and return the correct user id, video id, location, and extension', () => {
      const userId = 'user1';
      const videoId = 'video1';
      const location = 'source';
      const key = `videos/${userId}/${videoId}/${location}/some-file.mp4`;
      const { ext } = parse(key);

      const result = service.parseVideoKey(key);

      expect(result.userId).toEqual(userId);
      expect(result.videoId).toEqual(videoId);
      expect(result.location).toEqual(location);
      expect(result.ext).toEqual(ext);
    });
  });
});
