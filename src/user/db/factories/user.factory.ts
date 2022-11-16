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
    premium?: User['premium'];
  }) {
    const user = new User({
      picture: '',
      verified: false,
      admin: false,
      premium: { id: null, name: null, expiredAt: null, cancelled: null },
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
      premium: model.premium,
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
      premium: entity.premium,
    });
  }
}
