import { CacheModule as BaseCacheModule, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';

import { ConfigService } from 'src/config/services/config.service';
import { CacheService } from './services/cache.service';

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
          username: config.get('REDIS_USERNAME'),
          password: config.get('REDIS_PASSWORD'),
        });

        return { store: () => store } as unknown;
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
