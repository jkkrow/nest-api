import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { NotFoundException } from 'src/common/exceptions';
import { UpdateNameCommand } from '../impl/update-name.command';
import { UserRepository } from '../../models/user.repository';

@CommandHandler(UpdateNameCommand)
export class UpdateNameHandler implements ICommandHandler<UpdateNameCommand> {
  constructor(private readonly repository: UserRepository) {}

  async execute({ id, name }: UpdateNameCommand) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.updateName(name);

    await this.repository.save(user);

    user.commit();
  }
}
