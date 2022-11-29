import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

import {
  IsEqualTo,
  IsStrongPassword,
} from 'src/common/decorators/validator.decorator';

export class SignupRequest {
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  name: string;

  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsEqualTo('password')
  confirmPassword: string;
}
