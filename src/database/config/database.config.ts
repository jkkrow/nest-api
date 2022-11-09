import {
  TypeOrmModuleOptions,
  TypeOrmModuleAsyncOptions,
} from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import 'dotenv/config';

import { ConfigService } from 'src/config/config.service';

const config = new ConfigService();

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: config.get('DB_HOST'),
  port: config.get('DB_PORT'),
  username: config.get('DB_USERNAME'),
  database: config.get('DB_DATABASE'),
  password: config.get('DB_PASSWORD'),
  extra: {
    options: config.get('DB_OPTIONS'),
  },

  ssl: true,
  synchronize: false,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),

  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
};

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: () => {
    return typeOrmConfig;
  },
};

export default new DataSource(typeOrmConfig as DataSourceOptions);
