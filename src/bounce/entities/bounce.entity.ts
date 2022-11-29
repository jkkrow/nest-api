import { Entity, Column } from 'typeorm';

import { BaseEntityWithTimestamps } from 'src/database/entities/database.entity';

@Entity('bounces')
export class BounceEntity extends BaseEntityWithTimestamps {
  @Column({ type: 'varchar', length: 30, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 30 })
  sender: string;

  @Column({ type: 'varchar', length: 20 })
  type: string;

  @Column({ type: 'varchar', length: 200 })
  description: string;

  @Column({ type: 'varchar', length: 200 })
  details: string;

  @Column({ type: 'varchar', length: 20 })
  messageStream: string;

  @Column({ type: 'timestamp' })
  bouncedAt: Date;
}
