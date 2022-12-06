import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { MessageResponse } from 'src/common/dtos/response/message.response';
import { UnauthorizedException } from 'src/common/exceptions';
import { Role } from 'src/auth/decorators/role.decorator';
import { RequestUserId } from 'src/auth/decorators/user.decorator';
import { S3Service } from 'src/providers/aws/s3/services/s3.service';
import { InitiateMultipartUploadRequest } from '../dtos/request/initiate-multipart-upload.request';
import { InitiateMultipartUploadResponse } from '../dtos/response/initiate-multipart-upload.response';
import { ProcessMultipartUploadRequest } from '../dtos/request/process-multipart-upload.request';
import { ProcessMultipartUploadResponse } from '../dtos/response/process-multipart-upload.response';
import { CompleteMultipartUploadRequest } from '../dtos/request/complete-multipart-upload.request';
import { CompleteMultipartUploadResponse } from '../dtos/response/complete-multipart-upload.response';
import { CancelMultipartUploadRequest } from '../dtos/request/cancel-multipart-upload.request';
import { UploadImageRequest } from '../dtos/request/upload-image.request';
import { UploadImageResponse } from '../dtos/response/upload-image.response';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  /* Initiate Multipart Upload */
  /*--------------------------------------------*/
  @Post('multipart')
  @Role('verified')
  @HttpCode(200)
  @Serialize(InitiateMultipartUploadResponse)
  async initiateMultipartUpload(
    @Body() { videoId, fileName, fileType }: InitiateMultipartUploadRequest,
    @RequestUserId() userId: string,
  ) {
    const key = `videos/${userId}/${videoId}/${fileName}`;
    const result = await this.s3Service.initiateMultipart(key, fileType);

    return { uploadId: result.UploadId };
  }

  /* Process Multipart Upload */
  /*--------------------------------------------*/
  @Put('multipart/:uploadId')
  @Role('verified')
  @Serialize(ProcessMultipartUploadResponse)
  async processMultipartUpload(
    @Body() { videoId, fileName, partCount }: ProcessMultipartUploadRequest,
    @Param('uploadId') uploadId: string,
    @RequestUserId() userId: string,
  ) {
    const key = `videos/${userId}/${videoId}/${fileName}`;
    const presignedUrls = await this.s3Service.processMultipart(
      key,
      uploadId,
      partCount,
    );

    return { presignedUrls };
  }

  /* Complete Multipart Upload */
  /*--------------------------------------------*/
  @Post('multipart/:uploadId')
  @Role('verified')
  @HttpCode(200)
  @Serialize(CompleteMultipartUploadResponse)
  async completeMultipartUpload(
    @Body() { videoId, fileName, parts }: CompleteMultipartUploadRequest,
    @Param('uploadId') uploadId: string,
    @RequestUserId() userId: string,
  ) {
    const key = `videos/${userId}/${videoId}/${fileName}`;
    const result = await this.s3Service.completeMultipart(key, uploadId, parts);

    return { url: result.Key };
  }

  /* Cancel Multipart Upload */
  /*--------------------------------------------*/
  @Delete('multipart/:uploadId')
  @Role('verified')
  @Serialize(MessageResponse)
  async cancelMultipartUpload(
    @Body() { videoId, fileName }: CancelMultipartUploadRequest,
    @Param('uploadId') uploadId: string,
    @RequestUserId() userId: string,
  ) {
    const key = `videos/${userId}/${videoId}/${fileName}`;
    await this.s3Service.cancelMultipart(key, uploadId);

    return {
      message: 'Video upload cancelled successfully',
    };
  }

  /* Upload Image */
  /*--------------------------------------------*/
  @Put('images')
  @Role('verified')
  @Serialize(UploadImageResponse)
  async uploadImage(
    @Body() { key, fileType }: UploadImageRequest,
    @RequestUserId() userId: string,
  ) {
    if (key && key.split('/')[1] !== userId) {
      throw new UnauthorizedException('Image not belong to user');
    }

    const ext = fileType.split('/')[1];
    const newKey = `images/${userId}/${uuidv4()}.${ext}`;
    const presignedUrl = await this.s3Service.uploadObject(newKey, fileType);

    if (key) {
      await this.s3Service.deleteObject(key);
    }

    return { presignedUrl, key: newKey };
  }

  /* Delete Image */
  /*--------------------------------------------*/
  @Delete('images/:key')
  @Role('verified')
  @Serialize(MessageResponse)
  async deleteImage(
    @Param('key') key: string,
    @RequestUserId() userId: string,
  ) {
    if (key.split('/')[1] !== userId) {
      throw new UnauthorizedException('Image not belong to user');
    }

    await this.s3Service.deleteObject(key);

    return {
      message: 'Image deleted successfully',
    };
  }
}
