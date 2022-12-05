import { Entity, Column, OneToOne } from 'typeorm';

import { BaseEntityWithTimestamps } from 'src/providers/database/entities/database.entity';
import { MembershipEntity } from './membership.entity';
import { USER_TYPE, UserType } from '../constants/user.constant';

@Entity('users')
export class UserEntity extends BaseEntityWithTimestamps {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'enum', enum: Object.values(USER_TYPE) })
  type: UserType;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 200 })
  password: string;

  @Column({ type: 'varchar', length: 200 })
  picture: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({ type: 'boolean', default: false })
  admin: boolean;

  @OneToOne(() => MembershipEntity, (membership) => membership.user, {
    cascade: true,
    eager: true,
  })
  membership: MembershipEntity | null;
}
