import { Request } from 'express';

import { User } from 'src/modules/user/interfaces/user.interface';

export interface RequestWithUser extends Request {
  userId?: string;
  user?: RequestUser;
}

export interface RequestUser extends User {}
