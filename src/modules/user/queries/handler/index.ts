import { GetUserHandler } from './get-user.handler';
import { SigninHandler } from './signin.handler';
import { SignoutHandler } from './signout.handler';
import { GoogleSigninHandler } from './google-signin.handler';
import { GetCredentialsHandler } from './get-credentials.handler';

export const QueryHandlers = [
  GetUserHandler,
  SigninHandler,
  SignoutHandler,
  GoogleSigninHandler,
  GetCredentialsHandler,
];
