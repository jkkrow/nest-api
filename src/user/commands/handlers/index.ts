import { CreateUserHandler } from './create-user.handler';
import { CreateGoogleUserCommand } from '../impl/create-google-user.command';
import { SendVerificationHandler } from './send-verification.handler';
import { CheckVerificationHandler } from './check-verification.handler';
import { SendRecoveryHandler } from './send-recovery.handler';
import { CheckRecoveryHandler } from './check-recovery.handler';
import { ResetPasswordHandler } from './reset-password.handler';

export const CommandHandlers = [
  CreateUserHandler,
  CreateGoogleUserCommand,
  SendVerificationHandler,
  CheckVerificationHandler,
  SendRecoveryHandler,
  CheckRecoveryHandler,
  ResetPasswordHandler,
];
