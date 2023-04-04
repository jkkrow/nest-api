import AWS from 'aws-sdk';

import { ConfigService } from 'src/config/services/config.service';

const config = new ConfigService();

const accessKeyId = config.get('AWS_CONFIG_ACCESS_KEY_ID');
const secretAccessKey = config.get('AWS_CONFIG_SECRET_ACCESS_KEY');
const region = config.get('AWS_CONFIG_REGION');
const mediaConvertEndpoint = config.get('AWS_MEDIACONVERT_ENDPOINT');

AWS.config.update({
  credentials: { accessKeyId, secretAccessKey },
  region,
  signatureVersion: 'v4',
});

export const S3 = new AWS.S3();
export const MediaConvert = new AWS.MediaConvert({
  endpoint: mediaConvertEndpoint,
});
