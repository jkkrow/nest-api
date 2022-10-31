import { IsNumber, IsString } from 'class-validator';

export class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsString()
  APPLICATION_NAME: string;
  @IsString()
  CLIENT_URL: string;
  @IsString()
  JWT_KEY: string;

  @IsString()
  AUTH_CREDENTIALS_USERNAME: string;
  @IsString()
  AUTH_CREDENTIALS_PASSWORD: string;
  @IsString()
  AUTH_CREDENTIALS_API_KEY: string;

  @IsString()
  MONGODB_URI: string;
  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  EMAIL_SERVER_API_TOKEN: string;
  @IsString()
  EMAIL_FROM: string;

  @IsString()
  AWS_CONFIG_ACCESS_KEY_ID: string;
  @IsString()
  AWS_CONFIG_SECRET_ACCESS_KEY: string;
  @IsString()
  AWS_CONFIG_REGION: string;
  @IsString()
  AWS_S3_BUCKET_SOURCE: string;
  @IsString()
  AWS_S3_BUCKET_MEDIA: string;
  @IsString()
  AWS_MEDIACONVERT_ROLE: string;
  @IsString()
  AWS_MEDIACONVERT_ENDPOINT: string;
  @IsString()
  AWS_CLOUDFRONT_MEDIA_URL: string;
  @IsString()
  AWS_CLOUDFRONT_SOURCE_URL: string;
  @IsString()
  AWS_CLOUDFRONT_KEY_PAIR_ID: string;

  @IsString()
  PAYPAL_API_URL: string;
  @IsString()
  PAYPAL_CLIENT_ID: string;
  @IsString()
  PAYPAL_APP_SECRET: string;
  @IsString()
  PAYPAL_WEBHOOK_ID: string;
}
