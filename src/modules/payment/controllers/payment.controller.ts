import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Serialize } from 'src/common/decorators/serialize.decorator';
import { Role } from 'src/auth/decorators/role.decorator';
import { RequestUserId } from 'src/auth/decorators/user.decorator';
import { PaymentService } from '../services/payment.service';
import { CreateSubscriptionRequest } from '../dtos/request/create-subscription.request';
import { CreateSubscriptionResponse } from '../dtos/response/create-subscription.response';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /* Create Subscription */
  /*--------------------------------------------*/
  @Post('subscriptions')
  @Role('verified')
  @Serialize(CreateSubscriptionResponse, { status: 201 })
  async createSubscription(
    @Body() { planName }: CreateSubscriptionRequest,
    @RequestUserId() id: string,
  ) {
    const subscription = await this.paymentService.createSubscription(
      planName,
      id,
    );

    return { subscriptionId: subscription.id };
  }
}
