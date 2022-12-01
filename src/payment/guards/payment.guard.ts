import { CanActivate, ExecutionContext } from '@nestjs/common';

import { PaymentService } from '../services/payment.service';

export class PaymentGuard implements CanActivate {
  constructor(private readonly paymentService: PaymentService) {}

  async canActivate(context: ExecutionContext) {
    const { body, headers } = context.switchToHttp().getRequest();

    await this.paymentService.verifyWebhookSignature(body, headers);

    return true;
  }
}
