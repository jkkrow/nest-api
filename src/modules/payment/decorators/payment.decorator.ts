import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';

import { WebhookBody } from '../interfaces/payment.interface';

export const PaymentEventType = () =>
  applyDecorators(
    Expose(),
    Transform(({ obj }: { obj: WebhookBody }) => {
      return obj.event_type;
    }),
  );

export const PaymentSubscriptionId = () =>
  applyDecorators(
    Expose(),
    Transform(({ obj }: { obj: WebhookBody }) => {
      if (obj.event_type === 'PAYMENT.SALE.COMPLETED') {
        return obj.resource.custom;
      }

      if (obj.event_type === 'BILLING.SUBSCRIPTION.CANCELLED') {
        return obj.resource.custom_id;
      }
    }),
  );

export const PaymentSubscriptionCustomId = () =>
  applyDecorators(
    Expose(),
    Transform(({ obj }: { obj: WebhookBody }) => {
      if (obj.event_type === 'PAYMENT.SALE.COMPLETED') {
        return obj.resource.billing_agreement_id;
      }

      if (obj.event_type === 'BILLING.SUBSCRIPTION.CANCELLED') {
        return obj.resource.id;
      }
    }),
  );
