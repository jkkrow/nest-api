import { Handler, Context, Callback } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

import { bootstrap } from './main';

let server: Handler;

async function generateServerlessInstance() {
  const app = await bootstrap(false);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await generateServerlessInstance());
  return server(event, context, callback);
};
