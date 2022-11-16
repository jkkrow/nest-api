import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

import { BaseEntityWithTimestamp } from 'src/database/entities/database.entity';
import { MembershipEntity } from './membership.entity';

@Entity('users')
export class UserEntity extends BaseEntityWithTimestamp {
  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'enum', enum: ['native', 'google'] })
  type: 'native' | 'google';

  @Column({ type: 'varchar', length: 30, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 200 })
  password: string;

  @Column({ type: 'varchar', length: 200 })
  picture: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({ type: 'boolean', default: false })
  admin: boolean;

  @OneToOne(() => MembershipEntity, { cascade: true, eager: true })
  @JoinColumn({ name: 'membership' })
  membership: MembershipEntity | null;
}
