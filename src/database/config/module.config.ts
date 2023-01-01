import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import { typeOrmConfig } from './database.config';

export const typeOrmModuleConfig: TypeOrmModuleAsyncOptions = {
  useFactory: () => {
    return {
      ...typeOrmConfig,
      autoLoadEntities: true,
    };
  },
};
