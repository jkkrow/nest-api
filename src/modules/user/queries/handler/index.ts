import { GetUserHandler } from './get-user.handler';
import { SigninHandler } from './signin-handler';
import { GoogleSigninHandler } from './google-signin.handler';
import { GetSessionHandler } from './get-session.handler';

export const QueryHandlers = [
  GetUserHandler,
  SigninHandler,
  GoogleSigninHandler,
  GetSessionHandler,
];
