import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

import { ConfigService } from 'src/config/services/config.service';
import { UploadPart } from '../interfaces/s3.interface';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    const region = this.config.get('AWS_CONFIG_REGION');
    const accessKeyId = this.config.get('AWS_CONFIG_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get('AWS_CONFIG_SECRET_ACCESS_KEY');
    const credentials = { accessKeyId, secretAccessKey };

    this.client = new S3Client({ credentials, region });
    this.bucket = this.config.get('AWS_S3_BUCKET');
  }

  async initiateMultipart(key: string, fileType: string) {
    const command = new CreateMultipartUploadCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: fileType,
    });

    return this.client.send(command);
  }

  async processMultipart(key: string, uploadId: string, partCount: number) {
    const presignedUrlPromises: Promise<string>[] = [];

    for (let index = 0; index < partCount; index++) {
      const command = new UploadPartCommand({
        Bucket: this.bucket,
        Key: key,
        UploadId: uploadId,
        PartNumber: index + 1,
      });

      presignedUrlPromises.push(getSignedUrl(this.client, command));
    }

    return Promise.all(presignedUrlPromises);
  }

  async completeMultipart(key: string, uploadId: string, parts: UploadPart[]) {
    const command = new CompleteMultipartUploadCommand({
      Bucket: this.bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    });

    return this.client.send(command);
  }

  async cancelMultipart(key: string, uploadId: string) {
    const command = new AbortMultipartUploadCommand({
      Bucket: this.bucket,
      Key: key,
      UploadId: uploadId,
    });

    return this.client.send(command);
  }

  async uploadObject(key: string, fileType: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: fileType,
    });

    return getSignedUrl(this.client, command);
  }

  async deleteObject(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return this.client.send(command);
  }

  async deleteDirectory(key: string) {
    const prefixes = await this.getDirectoryPrefixes(key);

    if (prefixes.length > 0) {
      const command = new DeleteObjectsCommand({
        Bucket: this.bucket,
        Delete: { Objects: prefixes },
      });

      return this.client.send(command);
    } else {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      return this.client.send(command);
    }
  }

  private async getDirectoryPrefixes(key: string) {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: key,
      Delimiter: '/',
    });

    const listedObjects = await this.client.send(command);

    const listedContents = listedObjects.Contents;
    const listedPrefixes = listedObjects.CommonPrefixes;

    const prefixes: { Key: string }[] = [];
    const promises: Promise<{ Key: string }[]>[] = [];

    if (listedContents && listedContents.length) {
      listedContents.forEach(({ Key }) => {
        Key && prefixes.push({ Key });
      });
    }

    if (listedPrefixes && listedPrefixes.length) {
      listedPrefixes.forEach(({ Prefix }) => {
        Prefix && prefixes.push({ Key: Prefix });
        Prefix && promises.push(this.getDirectoryPrefixes(Prefix));
      });
    }

    const subPrefixes = await Promise.all(promises);

    subPrefixes.forEach((arrPrefixes) => {
      arrPrefixes.forEach((prefix) => {
        prefixes.push(prefix);
      });
    });

    return prefixes;
  }
}
