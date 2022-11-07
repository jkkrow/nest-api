import { Entity, Column } from 'typeorm';

import { DatabaseEntity } from 'src/database/entities/database.entity';

@Entity({ name: 'bounces' })
export class BounceEntity extends DatabaseEntity {
  @Column({ type: 'varchar', length: 30, unique: true })
  Email: string;

  @Column({ type: 'varchar', length: 30 })
  From: string;

  @Column({ type: 'varchar', length: 20 })
  Type: string;

  @Column({ type: 'varchar', length: 200 })
  Description: string;

  @Column({ type: 'varchar', length: 200 })
  Details: string;

  @Column({ type: 'varchar', length: 20 })
  MessageStream: string;

  @Column({ type: 'timestamp' })
  BouncedAt: Date;
}
