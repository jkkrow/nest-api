import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import 'dotenv/config';

import { ConfigService } from 'src/config/services/config.service';

const config = new ConfigService();

export const typeOrmConfig: DataSourceOptions = {
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
