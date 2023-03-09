import { CreateUserHandler } from './create-user.handler';
import { CreateGoogleUserHandler } from './create-google-user.handler';
import { SendVerificationHandler } from './send-verification.handler';
import { CheckVerificationHandler } from './check-verification.handler';
import { SendRecoveryHandler } from './send-recovery.handler';
import { CheckRecoveryHandler } from './check-recovery.handler';
import { ResetPasswordHandler } from './reset-password.handler';
import { UpdateNameHandler } from './update-name.handler';
import { UpdatePasswordHandler } from './update-password.handler';
import { UpdatePictureHandler } from './update-picture.handler';
import { CreateMembershipHandler } from './create-membership.handler';
import { CancelMembershipHandler } from './cancel-membership.handler';
import { UpdateMembershipHandler } from './update-membership-handler';
import { DeleteUserHandler } from './delete-user.handler';
import { DeleteGoogleUserHandler } from './delete-google-user.handler';

export const CommandHandlers = [
  CreateUserHandler,
  CreateGoogleUserHandler,
  SendVerificationHandler,
  CheckVerificationHandler,
  SendRecoveryHandler,
  CheckRecoveryHandler,
  ResetPasswordHandler,
  UpdateNameHandler,
  UpdatePasswordHandler,
  UpdatePictureHandler,
  CreateMembershipHandler,
  CancelMembershipHandler,
  UpdateMembershipHandler,
  DeleteUserHandler,
  DeleteGoogleUserHandler,
];
