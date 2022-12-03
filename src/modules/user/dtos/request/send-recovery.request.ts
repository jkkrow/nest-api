import { IsEmail } from 'class-validator';

export class SendRecoveryRequest {
  @IsEmail()
  email: string;
}
