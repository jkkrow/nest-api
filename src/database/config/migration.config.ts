import { DataSource } from 'typeorm';

import { typeOrmConfig } from './database.config';

export default new DataSource({
  ...typeOrmConfig,
  entities: [__dirname + '/../../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
});
