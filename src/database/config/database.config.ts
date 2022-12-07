import {
  TypeOrmModuleOptions,
  TypeOrmModuleAsyncOptions,
} from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import 'dotenv/config';

import { ConfigService } from 'src/config/services/config.service';

const config = new ConfigService();

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: config.get('DB_HOST'),
  port: config.get('DB_PORT'),
  username: config.get('DB_USERNAME'),
  database: config.get('DB_DATABASE'),
  password: config.get('DB_PASSWORD'),
  ssl: config.get('DB_HOST') === 'localhost' ? false : true,
  extra: {
    options: config.get('DB_OPTIONS'),
  },

  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
};

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: () => {
    return {
      ...typeOrmConfig,
      autoLoadEntities: true,
    };
  },
};

export default new DataSource({
  ...typeOrmConfig,
  entities: [__dirname + '/../../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
} as DataSourceOptions);
