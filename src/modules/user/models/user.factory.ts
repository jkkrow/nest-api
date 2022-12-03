import { EventPublisher } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { Optional } from 'utility-types';

import { BaseFactory } from 'src/providers/database/models/database.factory';
import { UserEntity } from '../entities/user.entity';
import { User } from './user';

type CreateUserParams = Optional<
  User['props'],
  'picture' | 'verified' | 'admin' | 'membership'
>;

@Injectable()
export class UserFactory implements BaseFactory<UserEntity, User> {
  constructor(private readonly publisher: EventPublisher) {}

  create(params: CreateUserParams) {
    const user = this.publisher.mergeObjectContext(
      new User({
        picture: '',
        verified: false,
        admin: false,
        membership: null,
        ...params,
      }),
    );

    user.create();

    return user;
  }

  createEntity(model: User): UserEntity {
    return {
      id: model.id,
      type: model.type,
      email: model.email,
      name: model.name,
      password: model.password,
      picture: model.picture,
      verified: model.verified,
      admin: model.admin,
      membership: model.membership,
    } as UserEntity;
  }

  createFromEntity(entity: UserEntity): User {
    const user = new User({
      id: entity.id,
      type: entity.type,
      email: entity.email,
      name: entity.name,
      password: entity.password,
      picture: entity.picture,
      verified: entity.verified,
      admin: entity.admin,
      membership: entity.membership,
    });

    return this.publisher.mergeObjectContext(user);
  }
}
