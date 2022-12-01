import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { PaymentService } from 'src/payment/services/payment.service';
import { UpdateMembershipCommand } from '../impl/update-membership.command';
import { UserRepository } from '../../models/user.repository';
import { IMembership } from '../../interfaces/user.interface';

@CommandHandler(UpdateMembershipCommand)
export class UpdateMembershipHandler
  implements ICommandHandler<UpdateMembershipCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly paymentService: PaymentService,
  ) {}

  async execute({ subscriptionId }: UpdateMembershipCommand) {
    const subscription = await this.paymentService.getSubscription(
      subscriptionId,
    );

    const { billing_info, custom_id, plan_id } = subscription;

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
