import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

export async function bootstrap(serverless?: boolean) {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get('PORT') || 5000;
  const origin = config.get('CLIENT_URL');
  const appName = config.get('APPLICATION_NAME');

  const documentOptions = new DocumentBuilder()
    .setTitle(`${appName} API`)
    .setDescription(`A REST API for ${appName}`)
    .build();

  const document = SwaggerModule.createDocument(app, documentOptions);

  SwaggerModule.setup('api', app, document);

  app.enableCors({ origin });
  app.use(helmet());

  if (serverless) {
    return app;
  }

  await app.listen(port);
}

bootstrap();
