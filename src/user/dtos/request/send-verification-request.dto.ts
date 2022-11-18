import { IsEmail, MaxLength } from 'class-validator';

export class SendVerificationRequestDto {
  @IsEmail()
  @MaxLength(30)
  email: string;
}
