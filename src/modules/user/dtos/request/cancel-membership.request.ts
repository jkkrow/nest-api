import { IsOptional, IsString } from 'class-validator';

export class CancelMembershipRequest {
  @IsOptional()
  @IsString()
  reason?: string;
}
