import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import dayjs from 'dayjs';

import { BadRequestException, NotFoundException } from 'src/common/exceptions';
import { PaymentService } from 'src/modules/payment/services/payment.service';
import { CreateMembershipCommand } from '../impl/create-membership.command';
import { UserRepository } from '../../models/user.repository';
import { Membership } from '../../interfaces/user.interface';

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
    const payedAt = dayjs(billing_info.last_payment.time);
    const isPayedNow = dayjs().isBefore(payedAt.add(1, 'minute'));
    const isActive = status === 'ACTIVE';
    const isUserMatched = id === custom_id;

    if (!isPayedNow || !isActive || !isUserMatched) {
      throw new BadRequestException('Invalid access');
    }

    // Find user and create membership
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
