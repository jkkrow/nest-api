import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmModuleConfig } from 'src/database/config/module.config';
import 'src/database/extensions';

@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmModuleConfig)],
})
export class DatabaseModule extends TypeOrmModule {
  constructor() {
    super();
  }
}
