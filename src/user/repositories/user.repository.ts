import { Injectable } from '@nestjs/common';

import { User } from '../user.model';

@Injectable()
export class UserRepository {
  createUser(userId: string) {
    const user = new User('', '', '', '', '', true, true, {} as any, []);

    user.createUser(userId);

    return user;
  }
}
