import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';

import { IMembership } from '../interfaces/user.interface';
import { UserEntity } from './user.entity';

@Entity('memberships')
export class MembershipEntity implements IMembership {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  id: string;

  @Column({ type: 'enum', enum: ['standard', 'business', 'enterprise'] })
  name: IMembership['name'];

  @Column({ type: 'timestamp' })
  expiredAt: Date;

  @Column({ type: 'boolean' })
  cancelled: boolean;

  @OneToOne(() => UserEntity, (user) => user.membership, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
