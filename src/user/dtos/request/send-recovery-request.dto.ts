import { IsEmail } from 'class-validator';

export class SendRecoveryRequestDto {
  @IsEmail()
  email: string;
}
