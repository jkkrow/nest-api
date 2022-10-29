import { Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';

import { ConfigService } from 'src/config/config.service';

@Injectable()
export class CloudService {
  public readonly AWS: typeof AWS;

  constructor(private readonly config: ConfigService) {
    const accessKeyId = this.config.get('AWS_CONFIG_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get('AWS_CONFIG_SECRET_ACCESS_KEY');
    const region = this.config.get('AWS_CONFIG_REGION');

    AWS.config.update({
      credentials: { accessKeyId, secretAccessKey },
      region,
    });

    this.AWS = AWS;
  }
}
