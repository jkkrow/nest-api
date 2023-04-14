import {
  MediaConvertClient,
  CreateJobCommand,
  GetJobTemplateCommand,
} from '@aws-sdk/client-mediaconvert';
import { Injectable } from '@nestjs/common';
import { parse } from 'path';

import { NotFoundException } from 'src/common/exceptions';
import { ConfigService } from 'src/config/services/config.service';

@Injectable()
export class MediaConvertService {
  private readonly client: MediaConvertClient;
  private readonly applicationId: string;
  private readonly role: string;
  private readonly jobTemplate: string;
  private readonly ext: string;

  constructor(private readonly config: ConfigService) {
    const region = this.config.get('AWS_CONFIG_REGION');
    const accessKeyId = this.config.get('AWS_CONFIG_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get('AWS_CONFIG_SECRET_ACCESS_KEY');
    const endpoint = config.get('AWS_MEDIACONVERT_ENDPOINT');
    const credentials = { accessKeyId, secretAccessKey };

    this.client = new MediaConvertClient({ credentials, endpoint, region });
    this.applicationId = this.config.get('APPLICATION_ID');
    this.role = this.config.get('AWS_MEDIACONVERT_ROLE');
    this.jobTemplate = this.config.get('AWS_MEDIACONVERT_JOB_TEMPLATE');
    this.ext = this.config.get('AWS_MEDIACONVERT_EXT');
  }

  async createJob(key: string, bucket: string) {
    const template = await this.getJobTemplate();
    const settings = this.createSettings(key, bucket);
    const jobTemplate = this.updateJobTemplate(template, settings);

    const command = new CreateJobCommand(jobTemplate);

    return this.client.send(command);
  }

  private async getJobTemplate() {
    const command = new GetJobTemplateCommand({
      Name: this.jobTemplate,
    });

    const { JobTemplate } = await this.client.send(command);

    if (!JobTemplate) {
      throw new NotFoundException('Job template not found');
    }

    return JobTemplate;
  }

  private createSettings(key: string, bucket: string) {
    const { dir, base, name } = parse(key);
    const outputVideoDir = dir.replace('source', 'converted');
    const outputThumbnailDir = dir.replace('source', 'thumbnails');

    const inputPath = `s3://${bucket}/${key}`;
    const outputVideoPath = `s3://${bucket}/${outputVideoDir}/${name}/`;
    const outputThumbnailPath = `s3://${bucket}/${outputThumbnailDir}/${name}/`;

    const metadata = {
      applicationId: this.applicationId,
      key: `${outputVideoDir}/${name}/${name}.${this.ext}`,
      thumbnail: `${outputThumbnailDir}/${name}/${name}.0000000.jpg`,
      name: base,
    };

    return { inputPath, outputVideoPath, outputThumbnailPath, metadata };
  }

  private updateJobTemplate(
    template: any,
    settings: {
      inputPath: string;
      outputVideoPath: string;
      outputThumbnailPath: string;
      metadata: any;
    },
  ) {
    const { inputPath, outputVideoPath, outputThumbnailPath, metadata } =
      settings;

    const jobTemplate = {
      Settings: template.Settings,
      UserMetadata: metadata,
      Role: this.role,
    };

    jobTemplate.Settings.Inputs[0].FileInput = inputPath;

    for (const group of jobTemplate.Settings.OutputGroups) {
      switch (group.OutputGroupSettings.Type) {
        case 'FILE_GROUP_SETTINGS':
          group.OutputGroupSettings.FileGroupSettings.Destination =
            outputThumbnailPath;
          break;
        case 'HLS_GROUP_SETTINGS':
          group.OutputGroupSettings.HlsGroupSettings.Destination =
            outputVideoPath;
          break;
        case 'DASH_ISO_GROUP_SETTINGS':
          group.OutputGroupSettings.DashIsoGroupSettings.Destination =
            outputVideoPath;
          break;
        case 'MS_SMOOTH_GROUP_SETTINGS':
          group.OutputGroupSettings.MsSmoothGroupSettings.Destination =
            outputVideoPath;
          break;
        case 'CMAF_GROUP_SETTINGS':
          group.OutputGroupSettings.CmafGroupSettings.Destination =
            outputVideoPath;
          break;
        default:
          throw new Error('Invalid OutputGroupSettings.');
      }
    }

    return jobTemplate;
  }
}
