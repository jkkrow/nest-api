import localtunnel from 'localtunnel';

import { ConfigService } from 'src/config/services/config.service';

export async function createLocalDomain() {
  const config = new ConfigService();
  const port = config.get('PORT');

  const tunnel = await localtunnel({ port });

  return tunnel.url;
}
