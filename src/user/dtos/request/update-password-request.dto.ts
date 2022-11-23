import { IsString } from 'class-validator';

import { IsEqualTo } from 'src/common/decorators/match.decorator';
import { IsStrongPassword } from '../../decorators/password.decorator';

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
