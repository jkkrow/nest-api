import { IsString } from 'class-validator';

import { IsEqualTo } from 'src/common/decorators/validator.decorator';
import { IsStrongPassword } from '../../decorators/validator.decorator';

export class UpdatePasswordRequestDto {
  @IsString()
  password: string;

  @IsString()
  @IsStrongPassword()
  newPassword: string;

  @IsString()
  @IsEqualTo('newPassword')
  confirmPassword: string;
}
