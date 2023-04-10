import AWS from 'src/providers/aws/config/aws.config';
import { ConfigService } from 'src/config/services/config.service';

export async function updateEventBridgeWebhooks(domain: string) {
  const eventBridge = new AWS.EventBridge();
  const config = new ConfigService();
  const applicationId = config.get('APPLICATION_ID');

  const initiateName = `${applicationId}-initiate-video-convert`;
  const initiateEndpoint = `${domain}/upload/videos/convert`;

  const completeName = `${applicationId}-complete-video-convert`;
  const completeEndpoint = `${domain}/upload/videos/convert/complete`;

  return Promise.all([
    eventBridge
      .updateApiDestination({
        Name: initiateName,
        InvocationEndpoint: initiateEndpoint,
      })
      .promise(),
    eventBridge
      .updateApiDestination({
        Name: completeName,
        InvocationEndpoint: completeEndpoint,
      })
      .promise(),
  ]);
}
