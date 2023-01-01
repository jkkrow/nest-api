import { typeOrmConfig } from './database.config';

export default {
  ...typeOrmConfig,
  entities: [__dirname + '/../../**/*.entity.{ts,js}'],
  factories: [__dirname + '/../seeding/factories/*.{ts,js}'],
  seeds: [__dirname + '/../seeding/seeds/*.{ts,js}'],
};
