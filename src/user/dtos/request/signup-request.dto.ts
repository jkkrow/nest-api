import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

import { IsEqualTo } from 'src/common/decorators/match.decorator';
import { IsStrongPassword } from '../../decorators/password.decorator';

export class SignupRequestDto {
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  name: string;

  @IsEmail()
  @MaxLength(30)
  email: string;

  @IsString()
  @MaxLength(50)
  @IsStrongPassword()
  password: string;

  @IsString()
  @MaxLength(50)
  @IsEqualTo('password')
  confirmPassword: string;
}
