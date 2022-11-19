import { Entity, Column, OneToOne } from 'typeorm';

import { BaseEntityWithTimestamp } from 'src/database/entities/database.entity';
import { MembershipEntity } from './membership.entity';
import { IUser } from 'src/user/interfaces/user.interface';
import { UserType } from '../../constants/user.constant';

@Entity('users')
export class UserEntity extends BaseEntityWithTimestamp implements IUser {
  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'enum', enum: ['native', 'google'] })
  type: UserType;

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

  @OneToOne(() => MembershipEntity, (membership) => membership.user, {
    cascade: true,
    eager: true,
  })
  membership: MembershipEntity | null;
}
