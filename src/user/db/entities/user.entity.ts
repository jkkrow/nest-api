import { Entity, Column } from 'typeorm';

import { BaseEntityWithTimestamp } from 'src/database/entities/database.entity';
import { PremiumColumn } from '../columns/premium.column';

@Entity('users')
export class UserEntity extends BaseEntityWithTimestamp {
  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'enum', enum: ['native', 'google'] })
  type: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  password: string;

  @Column({ type: 'varchar', length: 200 })
  picture: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({ type: 'boolean', default: false })
  admin: boolean;

  @Column(() => PremiumColumn)
  premium: PremiumColumn;
}
