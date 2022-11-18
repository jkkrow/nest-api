import { CreateUserHandler } from './create-user.handler';
import { CreateGoogleUserCommand } from '../impl/create-google-user.command';
import { SendVerificationHandler } from './send-verification.handler';

export const CommandHandlers = [
  CreateUserHandler,
  CreateGoogleUserCommand,
  SendVerificationHandler,
];
