import { Entity, Column, PrimaryColumn } from 'typeorm';

import { IMembership } from '../../interfaces/user.interface';

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
}
