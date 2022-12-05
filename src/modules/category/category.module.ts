import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/providers/database/database.module';
import { CategoryEntity } from './entities/category.entity';

@Module({
  imports: [DatabaseModule.forFeature([CategoryEntity])],
})
export class CategoryModule {}
