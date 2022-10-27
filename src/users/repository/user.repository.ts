import { Injectable } from '@nestjs/common';

import { User } from '../models/user.model';

@Injectable()
export class UserRepository {
  createUser(userId: string) {
    const user = new User();

    user.createUser(userId);

    return user;
  }
}
