import { CreateUserHandler } from './create-user.handler';
import { CreateGoogleUserCommand } from '../impl/create-google-user.command';
import { SendVerificationHandler } from './send-verification.handler';
import { CheckVerificationHandler } from './check-verification.handler';

export const CommandHandlers = [
  CreateUserHandler,
  CreateGoogleUserCommand,
  SendVerificationHandler,
  CheckVerificationHandler,
];
