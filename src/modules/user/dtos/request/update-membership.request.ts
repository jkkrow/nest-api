import { IsString } from 'class-validator';

import {
  PaymentEventType,
  PaymentSubscriptionId,
  PaymentSubscriptionCustomId,
} from 'src/modules/payment/decorators/payment.decorator';
import { EventType } from 'src/modules/payment/interfaces/payment.interface';

export class UpdateMembershipRequest {
  @IsString()
  @PaymentEventType()
  eventType: EventType;

  @IsString()
  @PaymentSubscriptionId()
  subscriptionId: string;

  @IsString()
  @PaymentSubscriptionCustomId()
  userId: string;
}
