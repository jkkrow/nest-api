import { NotFoundException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GetUserQuery } from '../impl/get-user.query';
import { UserSchema } from '../../schemas/user.schema';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserSchema>,
  ) {}

  async execute(query: GetUserQuery) {
    const { userId } = query;

    const user = await this.userModel.findById(userId, {}, { lean: true });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
