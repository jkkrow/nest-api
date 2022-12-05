import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';

import { UserEntity } from './user.entity';
import { MEMBERSHIP_NAME, MembershipName } from '../constants/user.constant';

@Entity('memberships')
export class MembershipEntity {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  id: string;

  @Column({ type: 'enum', enum: Object.values(MEMBERSHIP_NAME) })
  name: MembershipName;

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
