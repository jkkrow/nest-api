import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/providers/database/database.module';
import { BounceController } from './controllers/bounce.controller';
import { BounceService } from './services/bounce.service';
import { BounceEntity } from './entities/bounce.entity';

@Module({
  imports: [DatabaseModule.forFeature([BounceEntity])],
  controllers: [BounceController],
  providers: [BounceService],
  exports: [BounceService],
})
export class BounceModule {}
