import { Expose } from 'class-transformer';

import { IMembership } from '../../interfaces/user.interface';
import { MembershipName } from '../../constants/user.constant';

export class MembershipResponse implements IMembership {
  @Expose()
  id: string;

  @Expose()
  name: MembershipName;

  @Expose()
  expiredAt: Date;

  @Expose()
  cancelled: boolean;
}
