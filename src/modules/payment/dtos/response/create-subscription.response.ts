import { Expose } from 'class-transformer';

export class CreateSubscriptionResponse {
  @Expose()
  subscriptionId: string;
}
