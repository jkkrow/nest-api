import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { PaymentService } from 'src/payment/services/payment.service';
import { CreateMembershipCommand } from '../impl/create-membership.command';
import { UserRepository } from '../../models/user.repository';
import { IMembership } from '../../interfaces/user.interface';

@CommandHandler(CreateMembershipCommand)
export class CreateMembershipHandler
  implements ICommandHandler<CreateMembershipCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly paymentService: PaymentService,
  ) {}

  async execute({ id, subscriptionId }: CreateMembershipCommand) {
    const subscription = await this.paymentService.getSubscription(
      subscriptionId,
    );

    const { billing_info, custom_id, status, plan_id } = subscription;

    // Validate payment
    const payedAt = new Date(billing_info.last_payment.time);
    const isPayedNow = new Date(payedAt.getTime() + 60000) > new Date();
    const isActive = status === 'ACTIVE';
    const isUserMatched = id === custom_id;

    if (!isPayedNow || !isActive || !isUserMatched) {
      throw new BadRequestException('Invalid access');
    }

    // Find user and create membership
    const user = await this.repository.findById(custom_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { name } = await this.paymentService.getPlan(plan_id);

    const nextBillingTime = new Date(billing_info.next_billing_time);
    const expiredAt = new Date(nextBillingTime.setUTCHours(23, 59, 59, 999));

    const membership: IMembership = {
      id: subscriptionId,
      name: name.toLowerCase() as IMembership['name'],
      expiredAt,
      cancelled: false,
    };

    user.updateMembership(membership);

    await this.repository.save(user);

    user.commit();
  }
}
