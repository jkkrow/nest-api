import { IsString } from 'class-validator';

export class CreateMembershipRequest {
  @IsString()
  subscriptionId: string;
}
