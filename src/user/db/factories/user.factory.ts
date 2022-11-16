import { Injectable } from '@nestjs/common';

import { BaseFactory } from 'src/database/factories/database.factory';
import { UserEntity } from '../entities/user.entity';
import { User } from '../../user.model';

@Injectable()
export class UserFactory implements BaseFactory<UserEntity, User> {
  create(params: {
    id: User['id'];
    type: User['type'];
    name: User['name'];
    email: User['email'];
    password: User['password'];
    picture?: User['picture'];
    verified?: User['verified'];
    admin?: User['admin'];
    membership?: User['membership'];
  }) {
    const user = new User({
      picture: '',
      verified: false,
      admin: false,
      membership: null,
      ...params,
    });

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
    return new User({
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
  }
}
