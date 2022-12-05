import { Entity, Column } from 'typeorm';

import { BaseEntity } from 'src/providers/database/entities/database.entity';

@Entity('categories')
export class CategoryEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 30 })
  name: string;
}
