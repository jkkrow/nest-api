import { Expose } from 'class-transformer';

import { MembershipName } from '../../constants/user.constant';

export class MembershipResponse {
  @Expose()
  id: string;

  @Expose()
  name: MembershipName;

  @Expose()
  expiresIn: Date;

  @Expose()
  cancelled: boolean;
}
