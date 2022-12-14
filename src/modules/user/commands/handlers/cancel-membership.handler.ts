import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  NotFoundException,
  UnauthorizedException,
} from 'src/common/exceptions';
import { PaymentService } from 'src/modules/payment/services/payment.service';
import { CancelMembershipCommand } from '../impl/cancel-membership.command';
import { UserRepository } from '../../models/user.repository';
import { IMembership } from '../../interfaces/user.interface';

@CommandHandler(CancelMembershipCommand)
export class CancelMembershipHandler
  implements ICommandHandler<CancelMembershipCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly paymentService: PaymentService,
  ) {}

  async execute({ id, reason }: CancelMembershipCommand) {
    const user = await this.repository.findOneById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.membership) {
      throw new UnauthorizedException('User must be a member');
    }

    const membership: IMembership = {
      ...user.membership,
      cancelled: true,
    };

    user.updateMembership(membership);

    await this.paymentService.cancelSubscription(user.membership.id, reason);
    await this.repository.save(user);

    user.commit();
  }
}
