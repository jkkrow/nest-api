import AWS from 'aws-sdk';

import { ConfigService } from 'src/config/services/config.service';

const config = new ConfigService();

const accessKeyId = config.get('AWS_CONFIG_ACCESS_KEY_ID');
const secretAccessKey = config.get('AWS_CONFIG_SECRET_ACCESS_KEY');
const region = config.get('AWS_CONFIG_REGION');

AWS.config.update({
  credentials: { accessKeyId, secretAccessKey },
  region,
  signatureVersion: 'v4',
});

export default AWS;
