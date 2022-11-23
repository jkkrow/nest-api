import { Expose, Type } from 'class-transformer';
import { MembershipDto } from '../membership.dto';

export class GetMembershipResponseDto {
  @Expose()
  @Type(() => MembershipDto)
  membership: MembershipDto | null;
}
