import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import dayjs from 'dayjs';

import { NotFoundException } from 'src/common/exceptions';
import { PaymentService } from 'src/modules/payment/services/payment.service';
import { UpdateMembershipCommand } from '../impl/update-membership.command';
import { UserRepository } from '../../models/user.repository';
import { Membership } from '../../interfaces/user.interface';

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

    const user = await this.repository.findOneById(custom_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { name } = await this.paymentService.getPlan(plan_id);

    const nextBillingTime = dayjs(billing_info.next_billing_time);
    const expiresIn = nextBillingTime.endOf('date').toDate();

    const membership: Membership = {
      id: subscriptionId,
      name: name.toLowerCase() as Membership['name'],
      expiresIn,
      cancelled: false,
    };

    user.updateMembership(membership);

    await this.repository.save(user);

    user.commit();
  }
}
