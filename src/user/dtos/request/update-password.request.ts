import { IsString } from 'class-validator';

import {
  IsEqualTo,
  IsStrongPassword,
} from 'src/common/decorators/validator.decorator';

export class UpdatePasswordRequest {
  @IsString()
  password: string;

  @IsString()
  @IsStrongPassword()
  newPassword: string;

  @IsString()
  @IsEqualTo('newPassword')
  confirmPassword: string;
}
