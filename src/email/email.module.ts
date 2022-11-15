import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { BounceEntity } from './db/entities/bounce.entity';

@Module({
  imports: [DatabaseModule.forFeature([BounceEntity])],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
