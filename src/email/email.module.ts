import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { BounceSchema, BounceSchemaClass } from './schemas/bounce.schema';

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: BounceSchema.name, schema: BounceSchemaClass },
    ]),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
