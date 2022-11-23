import { IsString, MaxLength } from 'class-validator';

import { IsEqualTo } from 'src/common/decorators/validator.decorator';
import { IsStrongPassword } from '../../decorators/validator.decorator';

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
