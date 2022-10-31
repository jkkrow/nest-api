import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DatabaseRepository } from 'src/database/repositories/database.repository';
import { UserSchemaFactory } from '../schemas/user-schema.factory';

import { User } from '../user.model';
import { UserSchema } from '../schemas/user.schema';

@Injectable()
export class UserRepository extends DatabaseRepository<UserSchema, User> {
  constructor(
    @InjectModel(UserSchema.name) private readonly userModel: Model<UserSchema>,
    private readonly userSchemaFactory: UserSchemaFactory,
  ) {
    super(userModel, userSchemaFactory);
  }
}
