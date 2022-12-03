import { GetUserHandler } from './get-user.handler';
import { SigninHandler } from './signin-handler';
import { GoogleSigninHandler } from './google-signin.handler';
import { GetAuthTokenHandler } from './get-auth-token.handler';

export const QueryHandlers = [
  GetUserHandler,
  SigninHandler,
  GoogleSigninHandler,
  GetAuthTokenHandler,
];
