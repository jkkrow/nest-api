import { Request } from 'express';

import { IUser } from 'src/modules/user/interfaces/user.interface';

export interface IRequestWithUser extends Request {
  userId?: string;
  user?: IRequestUser;
}

export interface IRequestUser extends IUser {}
