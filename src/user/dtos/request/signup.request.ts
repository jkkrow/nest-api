import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

import { IsEqualTo } from 'src/common/decorators/validator.decorator';
import { IsStrongPassword } from '../../decorators/validator.decorator';

export class SignupRequest {
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  name: string;

  @IsEmail()
  @MaxLength(30)
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsEqualTo('password')
  confirmPassword: string;
}
