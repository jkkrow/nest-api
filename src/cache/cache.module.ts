import {
  CacheModule as BaseCacheModule,
  CacheStore,
  Module,
} from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';

import { ConfigService } from 'src/config/config.service';
import { CacheService } from './cache.service';

@Module({
  imports: [
    BaseCacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
          },
          password: config.get('REDIS_PASSWORD'),
        });

        return { store: () => store } as unknown as CacheStore;
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
