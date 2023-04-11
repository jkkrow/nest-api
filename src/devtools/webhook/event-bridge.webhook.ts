import {
  EventBridgeClient,
  UpdateApiDestinationCommand,
} from '@aws-sdk/client-eventbridge';
import { ConfigService } from 'src/config/services/config.service';

export async function updateEventBridgeWebhooks(domain: string) {
  const config = new ConfigService();

  const applicationId = config.get('APPLICATION_ID');
  const region = config.get('AWS_CONFIG_REGION');
  const accessKeyId = config.get('AWS_CONFIG_ACCESS_KEY_ID');
  const secretAccessKey = config.get('AWS_CONFIG_SECRET_ACCESS_KEY');
  const credentials = { accessKeyId, secretAccessKey };

  const client = new EventBridgeClient({ credentials, region });

  const initiateName = `${applicationId}-initiate-video-convert`;
  const initiateEndpoint = `${domain}/upload/videos/convert`;

  const completeName = `${applicationId}-complete-video-convert`;
  const completeEndpoint = `${domain}/upload/videos/convert/complete`;

  const updateInitiateCommand = new UpdateApiDestinationCommand({
    Name: initiateName,
    InvocationEndpoint: initiateEndpoint,
  });
  const updateCompleteCommand = new UpdateApiDestinationCommand({
    Name: completeName,
    InvocationEndpoint: completeEndpoint,
  });

  return Promise.all([
    client.send(updateInitiateCommand),
    client.send(updateCompleteCommand),
  ]);
}
