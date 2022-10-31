import { Injectable } from '@nestjs/common';

import { User } from './user.model';
import { IUserPremium } from './interfaces/user.interface';

@Injectable()
export class UserFactory {
  create(
    _id: string,
    type: string,
    name: string,
    email: string,
    password: string,
    picture?: string,
    verified?: boolean,
    admin?: boolean,
    premium?: IUserPremium | null,
    subscribers?: string[],
  ) {
    const user = new User(
      _id,
      type,
      name,
      email,
      password,
      picture || '',
      verified || false,
      admin || false,
      premium || null,
      subscribers || [],
    );

    user.createUser(_id, email);

    return user;
  }

  build(
    _id: string,
    type: string,
    name: string,
    email: string,
    password: string,
    picture?: string,
    verified?: boolean,
    admin?: boolean,
    premium?: IUserPremium | null,
    subscribers?: string[],
  ) {
    const user = new User(
      _id,
      type,
      name,
      email,
      password,
      picture || '',
      verified || false,
      admin || false,
      premium || null,
      subscribers || [],
    );

    return user;
  }
}
