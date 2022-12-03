import { Expose, Type } from 'class-transformer';
import { MembershipResponse } from './membership.response';

export class GetMembershipResponse {
  @Expose()
  @Type(() => MembershipResponse)
  membership: MembershipResponse | null;
}
