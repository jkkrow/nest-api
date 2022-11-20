import { IsString, MaxLength } from 'class-validator';

import { IsEqualTo } from 'src/common/decorators/match.decorator';
import { IsStrongPassword } from '../../decorators/password.decorator';

export class ResetPasswordRequestDto {
  @IsString()
  @MaxLength(50)
  @IsStrongPassword()
  password: string;

  @IsString()
  @MaxLength(50)
  @IsEqualTo('password')
  confirmPassword: string;
}
