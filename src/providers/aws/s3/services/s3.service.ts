import AWS from '../../config/aws.config';
import { Injectable } from '@nestjs/common';

import { ConfigService } from 'src/config/services/config.service';
import { UploadPart } from '../interfaces/s3.interface';

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    this.s3 = new AWS.S3();
    this.bucket = this.config.get('AWS_S3_BUCKET');
  }

  initiateMultipart(key: string, fileType: string) {
    const params = {
      Bucket: this.bucket,
      Key: key,
      ContentType: fileType,
    };

    return this.s3.createMultipartUpload(params).promise();
  }

  processMultipart(key: string, uploadId: string, partCount: number) {
    const params = {
      Bucket: this.bucket,
      Key: key,
      UploadId: uploadId,
    };

    const presignedUrlPromises: Promise<string>[] = [];

    for (let index = 0; index < partCount; index++) {
      presignedUrlPromises.push(
        this.s3.getSignedUrlPromise('uploadPart', {
          ...params,
          PartNumber: index + 1,
        }),
      );
    }

    return Promise.all(presignedUrlPromises);
  }

  completeMultipart(key: string, uploadId: string, parts: UploadPart[]) {
    const params = {
      Bucket: this.bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    };

    return this.s3.completeMultipartUpload(params).promise();
  }

  cancelMultipart(key: string, uploadId: string) {
    const params = {
      Bucket: this.bucket,
      Key: key,
      UploadId: uploadId,
    };

    return this.s3.abortMultipartUpload(params).promise();
  }

  uploadObject(key: string, fileType: string) {
    const params = {
      Bucket: this.bucket,
      Key: key,
      ContentType: fileType,
    };

    return this.s3.getSignedUrlPromise('putObject', params);
  }

  deleteObject(key: string) {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    return this.s3.deleteObject(params).promise();
  }

  async deleteDirectory(key: string) {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    const prefixes = await this.getDirectoryPrefixes(key);

    if (prefixes.length > 0) {
      const deleteParams = {
        Bucket: params.Bucket,
        Delete: { Objects: prefixes },
      };

      return this.s3.deleteObjects(deleteParams).promise();
    }

    return this.s3.deleteObject(params).promise();
  }

  private async getDirectoryPrefixes(key: string) {
    const params = {
      Bucket: this.bucket,
      Prefix: key,
      Delimiter: '/',
    };

    const prefixes: { Key: string }[] = [];
    const promises: Promise<{ Key: string }[]>[] = [];

    const listedObjects = await this.s3.listObjectsV2(params).promise();

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
