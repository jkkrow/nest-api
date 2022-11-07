import { Entity, Column } from 'typeorm';

import { DatabaseEntity } from 'src/database/entities/database.entity';
import { IUserPremium } from '../interfaces/user.interface';

@Entity({ name: 'premiums' })
export class PremiumEntity extends DatabaseEntity {
  @Column({ type: 'enum', enum: ['standard', 'business', 'enterprise'] })
  name: IUserPremium['name'];

  @Column({ type: 'timestamp' })
  expiredAt: Date;

  @Column({ type: 'boolean' })
  cancelled: boolean;
}
