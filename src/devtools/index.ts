import { Logger } from '@nestjs/common';

import { createLocalDomain } from './local-server';
import { updateEventBridgeWebhooks } from './webhook/event-bridge.webhook';

export async function updateDevelopmentWebhooks() {
  const domain = await createLocalDomain();
  Logger.log(`Local server running at ${domain}`);

  return Promise.all([updateEventBridgeWebhooks(domain)]);
}
