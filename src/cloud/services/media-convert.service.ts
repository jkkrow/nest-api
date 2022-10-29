import { Injectable, NotFoundException } from '@nestjs/common';
import { parse } from 'path';

import { ConfigService } from 'src/config/config.service';
import { CloudService } from './cloud.service';

@Injectable()
export class MediaConvertService {
  private readonly mediaConvert: AWS.MediaConvert;

  constructor(
    private readonly cloudService: CloudService,
    private readonly config: ConfigService,
  ) {
    const endpoint = this.config.get('AWS_MEDIACONVERT_ENDPOINT');

    this.mediaConvert = new this.cloudService.AWS.MediaConvert({ endpoint });
  }

  createJob(template: any) {
    return this.mediaConvert.createJob(template).promise();
  }

  async getJobTemplate(name: string) {
    const params = {
      Name: name,
    };

    const { JobTemplate } = await this.mediaConvert
      .getJobTemplate(params)
      .promise();

    if (!JobTemplate) {
      throw new NotFoundException('Job template not found');
    }

    return JobTemplate;
  }

  createMetadata(detail: any) {
    const sourceKey = detail.object.key.replace(/\+/g, ' ');
    const sourceBucket = detail.bucket.name;
    const destinationBucket = this.config.get('AWS_S3_BUCKET_MEDIA');

    const { dir, base, name } = parse(sourceKey);
    const inputPath = `s3://${sourceBucket}/${sourceKey}`;
    const outputPath = `s3://${destinationBucket}/${dir}/${name}/`;
    const jobMetadata = {
      application: this.config.get('APPLICATION_NAME'),
      key: `${dir}/${name}/${name}`,
      fileName: base,
      treeId: sourceKey.split('/')[2],
    };

    return { inputPath, outputPath, jobMetadata };
  }

  updateJobSettings(
    template: any,
    inputPath: string,
    outputPath: string,
    metadata: any,
  ) {
    const updatedTemplate = {
      Settings: template.Settings,
      UserMetadata: metadata,
      Role: this.config.get('AWS_MEDIACONVERT_ROLE'),
    };

    updatedTemplate.Settings.Inputs[0].FileInput = inputPath;

    for (const group of updatedTemplate.Settings.OutputGroups) {
      switch (group.OutputGroupSettings.Type) {
        case 'FILE_GROUP_SETTINGS':
          group.OutputGroupSettings.FileGroupSettings.Destination = outputPath;
          break;
        case 'HLS_GROUP_SETTINGS':
          group.OutputGroupSettings.HlsGroupSettings.Destination = outputPath;
          break;
        case 'DASH_ISO_GROUP_SETTINGS':
          group.OutputGroupSettings.DashIsoGroupSettings.Destination =
            outputPath;
          break;
        case 'MS_SMOOTH_GROUP_SETTINGS':
          group.OutputGroupSettings.MsSmoothGroupSettings.Destination =
            outputPath;
          break;
        case 'CMAF_GROUP_SETTINGS':
          group.OutputGroupSettings.CmafGroupSettings.Destination = outputPath;
          break;
        default:
          throw new Error('Invalid OutputGroupSettings.');
      }
    }

    return updatedTemplate;
  }
}
