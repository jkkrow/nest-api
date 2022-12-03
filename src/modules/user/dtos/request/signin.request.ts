import { IsString, IsEmail } from 'class-validator';

export class SigninRequest {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
