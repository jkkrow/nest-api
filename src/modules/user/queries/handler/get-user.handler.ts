import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { NotFoundException } from 'src/common/exceptions';
import { GetUserQuery } from '../impl/get-user.query';
import { UserRepository } from '../../repositories/user.repository';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly repository: UserRepository) {}

  async execute({ id }: GetUserQuery) {
    const user = await this.repository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
