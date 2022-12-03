import { IsString } from 'class-validator';

export class CreateSubscriptionRequest {
  @IsString()
  planName: string;
}
