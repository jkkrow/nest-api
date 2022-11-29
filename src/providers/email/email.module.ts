import { Module } from '@nestjs/common';

import { BounceModule } from 'src/bounce/bounce.module';
import { EmailService } from './services/email.service';

@Module({
  imports: [BounceModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
