import AWS from 'aws-sdk';
import { Injectable } from '@nestjs/common';

import { ConfigService } from 'src/config/services/config.service';

@Injectable()
export class S3Service {
  private readonly storage: AWS.S3;
  private readonly sourceBucket: string;

  constructor(private readonly config: ConfigService) {
    this.storage = new AWS.S3();
    this.sourceBucket = this.config.get('AWS_S3_BUCKET_SOURCE');
  }

  initiateMultipart(options: {
    bucket?: string;
    path: string;
    fileType: string;
  }) {
    const params = {
      Bucket: options.bucket || this.sourceBucket,
      Key: options.path,
      ContentType: options.fileType,
    };

    return this.storage.createMultipartUpload(params).promise();
  }

  processMultipart(options: {
    bucket?: string;
    path: string;
    uploadId: string;
    partCount: number;
  }) {
    const params = {
      Bucket: options.bucket || this.sourceBucket,
      Key: options.path,
      UploadId: options.uploadId,
    };

    const presignedUrlPromises: Promise<string>[] = [];

    for (let index = 0; index < options.partCount; index++) {
      presignedUrlPromises.push(
        this.storage.getSignedUrlPromise('uploadPart', {
          ...params,
          PartNumber: index + 1,
        }),
      );
    }

    return Promise.all(presignedUrlPromises);
  }

  completeMultipart(options: {
    bucket?: string;
    path: string;
    uploadId: string;
    parts: { ETag: string; PartNumber: number }[];
  }) {
    const params = {
      Bucket: options.bucket || this.sourceBucket,
      Key: options.path,
      UploadId: options.uploadId,
      MultipartUpload: { Parts: options.parts },
    };

    return this.storage.completeMultipartUpload(params).promise();
  }

  cancelMultipart(options: {
    bucket?: string;
    path: string;
    uploadId: string;
  }) {
    const params = {
      Bucket: options.bucket || this.sourceBucket,
      Key: options.path,
      UploadId: options.uploadId,
    };

    return this.storage.abortMultipartUpload(params).promise();
  }

  uploadObject(options: { bucket?: string; path: string; fileType: string }) {
    const params = {
      Bucket: options.bucket || this.sourceBucket,
      Key: options.path,
      ContentType: options.fileType,
    };

    return this.storage.getSignedUrlPromise('putObject', params);
  }

  deleteObject(options: { bucket?: string; path: string }) {
    const params = {
      Bucket: options.bucket || this.sourceBucket,
      Key: options.path,
    };

    return this.storage.deleteObject(params).promise();
  }

  async deleteDirectory(options: { bucket?: string; path: string }) {
    const params = {
      Bucket: options.bucket || this.sourceBucket,
      Key: options.path,
    };

    const prefixes = await this.getDirectoryPrefixes(options);

    if (prefixes.length > 0) {
      const deleteParams = {
        Bucket: params.Bucket,
        Delete: { Objects: prefixes },
      };

      return this.storage.deleteObjects(deleteParams).promise();
    }

    return this.storage.deleteObject(params).promise();
  }

  private async getDirectoryPrefixes(options: {
    bucket?: string;
    path: string;
  }) {
    const params = {
      Bucket: options.bucket || this.sourceBucket,
      Prefix: options.path,
      Delimiter: '/',
    };

    const prefixes: { Key: string }[] = [];
    const promises: Promise<{ Key: string }[]>[] = [];

    const listedObjects = await this.storage.listObjectsV2(params).promise();

    const listedContents = listedObjects.Contents;
    const listedPrefixes = listedObjects.CommonPrefixes;

    if (listedContents && listedContents.length) {
      listedContents.forEach(({ Key }) => {
        Key && prefixes.push({ Key });
      });
    }

    if (listedPrefixes && listedPrefixes.length) {
      listedPrefixes.forEach(({ Prefix }) => {
        Prefix && prefixes.push({ Key: Prefix });
        Prefix &&
          promises.push(
            this.getDirectoryPrefixes({ bucket: params.Bucket, path: Prefix }),
          );
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
