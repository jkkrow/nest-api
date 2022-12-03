import { IsEmail } from 'class-validator';

export class SendVerificationRequest {
  @IsEmail()
  email: string;
}
