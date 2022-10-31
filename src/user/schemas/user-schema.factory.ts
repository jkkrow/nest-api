import { Injectable } from '@nestjs/common';
import { DatabaseSchemaFactory } from 'src/database/schemas/database-schema.factory';

import { User } from '../user.model';
import { UserFactory } from '../user.factory';
import { UserSchema } from './user.schema';

@Injectable()
export class UserSchemaFactory
  implements DatabaseSchemaFactory<UserSchema, User>
{
  create(user: User): UserSchema {
    return {
      _id: user.getId(),
      type: user.getType(),
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      picture: user.getPicture(),
      verified: user.getVerified(),
      premium: user.getPremium(),
      admin: user.getAdmin(),
      subscribers: user.getSubscribers(),
    };
  }

  createFromSchema(userSchema: UserSchema): User {
    return new UserFactory().build(
      userSchema._id,
      userSchema.type,
      userSchema.name,
      userSchema.email,
      userSchema.password,
      userSchema.picture,
      userSchema.verified,
      userSchema.admin,
      userSchema.premium,
      userSchema.subscribers,
    );
  }
}
