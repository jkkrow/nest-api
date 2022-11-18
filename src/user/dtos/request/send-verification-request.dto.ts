import { IsEmail } from 'class-validator';

export class SendVerificationRequestDto {
  @IsEmail()
  email: string;
}
