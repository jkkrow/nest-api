import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';

import { Serialize } from 'src/common/decorators/serialize.decorator';
import { MessageResponse } from 'src/common/dtos/response/message.response';
import { Role } from 'src/auth/decorators/role.decorator';
import { CurrentUserId } from 'src/auth/decorators/user.decorator';
import { ApiKeyGuard } from 'src/auth/guards/apikey.guard';
import { S3Service } from 'src/providers/aws/s3/services/s3.service';
import { MediaConvertService } from 'src/providers/aws/media-convert/services/media-convert.service';
import { UpdateVideoNodesCommand } from 'src/modules/video-tree/commands/impl/update-video-nodes.command';
import { UploadService } from '../services/upload.service';
import { ConvertGuard } from '../guards/convert.guard';
import { InitiateMultipartUploadRequest } from '../dtos/request/initiate-multipart-upload.request';
import { InitiateMultipartUploadResponse } from '../dtos/response/initiate-multipart-upload.response';
import { ProcessMultipartUploadRequest } from '../dtos/request/process-multipart-upload.request';
import { ProcessMultipartUploadResponse } from '../dtos/response/process-multipart-upload.response';
import { CompleteMultipartUploadRequest } from '../dtos/request/complete-multipart-upload.request';
import { CompleteMultipartUploadResponse } from '../dtos/response/complete-multipart-upload.response';
import { CancelMultipartUploadRequest } from '../dtos/request/cancel-multipart-upload.request';
import { UploadImageRequest } from '../dtos/request/upload-image.request';
import { UploadImageResponse } from '../dtos/response/upload-image.response';
import { DeleteImageRequest } from '../dtos/request/delete-image.request';
import { InitiateVideoConvertRequest } from '../dtos/request/initiate-video-convert.request';
import { CompleteVideoConvertRequest } from '../dtos/request/complete-video-convert.request';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly uploadService: UploadService,
    private readonly s3Service: S3Service,
    private readonly mediaConvertService: MediaConvertService,
  ) {}

  /* Initiate Multipart Upload */
  /*--------------------------------------------*/
  @Post('multipart')
  @Role('verified')
  @Serialize(InitiateMultipartUploadResponse)
  async initiateMultipartUpload(
    @Body() { videoId, fileName, fileType }: InitiateMultipartUploadRequest,
    @CurrentUserId() userId: string,
  ) {
    this.uploadService.verifyVideoFileType(fileType);
    const key = this.uploadService.generateVideoKey(userId, videoId, fileName);
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
    @CurrentUserId() userId: string,
  ) {
    const key = this.uploadService.generateVideoKey(userId, videoId, fileName);
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
  @Serialize(CompleteMultipartUploadResponse)
  async completeMultipartUpload(
    @Body() { videoId, fileName, parts }: CompleteMultipartUploadRequest,
    @Param('uploadId') uploadId: string,
    @CurrentUserId() userId: string,
  ) {
    const key = this.uploadService.generateVideoKey(userId, videoId, fileName);
    const result = await this.s3Service.completeMultipart(key, uploadId, parts);

    return { url: result.Key };
  }

  /* Cancel Multipart Upload */
  /*--------------------------------------------*/
  @Delete('multipart/:uploadId')
  @Role('verified')
  @Serialize(MessageResponse)
  async cancelMultipartUpload(
    @Query() { videoId, fileName }: CancelMultipartUploadRequest,
    @Param('uploadId') uploadId: string,
    @CurrentUserId() userId: string,
  ) {
    const key = this.uploadService.generateVideoKey(userId, videoId, fileName);
    await this.s3Service.cancelMultipart(key, uploadId);

    return { message: 'Video upload cancelled successfully' };
  }

  /* Upload Image */
  /*--------------------------------------------*/
  @Put('images')
  @Role('verified')
  @Serialize(UploadImageResponse)
  async uploadImage(
    @Body() { key, fileType }: UploadImageRequest,
    @CurrentUserId() userId: string,
  ) {
    const isLocal = this.uploadService.verifyFileKey(key, userId);
    const newKey = this.uploadService.generateImageKey(userId, fileType);
    const presignedUrl = await this.s3Service.uploadObject(newKey, fileType);

    if (key && isLocal) {
      await this.s3Service.deleteObject(key);
    }

    return { presignedUrl, key: newKey };
  }

  /* Delete Image */
  /*--------------------------------------------*/
  @Delete('images')
  @Role('verified')
  @Serialize(MessageResponse)
  async deleteImage(
    @Query() { key }: DeleteImageRequest,
    @CurrentUserId() userId: string,
  ) {
    const isLocal = this.uploadService.verifyFileKey(key, userId);

    if (isLocal) {
      await this.s3Service.deleteObject(key);
    }

    return { message: 'Image deleted successfully' };
  }

  /* Initiate Video Convert */
  /*--------------------------------------------*/
  @Post('videos/convert')
  @UseGuards(ApiKeyGuard)
  @UseGuards(ConvertGuard)
  @Serialize(MessageResponse)
  @ApiSecurity('api_key')
  async initiateVideoConvert(
    @Body() { key, bucket }: InitiateVideoConvertRequest,
  ) {
    await this.mediaConvertService.createJob(key, bucket);

    return { message: 'Initiated video convert successfully' };
  }

  /* Complete Video Convert */
  /*--------------------------------------------*/
  @Post('videos/convert/complete')
  @UseGuards(ApiKeyGuard)
  @Serialize(MessageResponse)
  @ApiSecurity('api_key')
  async completeVideoConvert(
    @Body() { key, name }: CompleteVideoConvertRequest,
  ) {
    const updates = { url: key };
    const { videoId, userId } = this.uploadService.parseVideoKey(key);
    const command = new UpdateVideoNodesCommand(name, videoId, userId, updates);
    await this.commandBus.execute(command);

    return { message: 'Completed video convert successfully' };
  }
}
