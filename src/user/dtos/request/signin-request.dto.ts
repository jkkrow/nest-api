import { IsString, IsEmail, MaxLength } from 'class-validator';

export class SigninRequestDto {
  @IsEmail()
  @MaxLength(30)
  email: string;

  @IsString()
  password: string;
}
