import { IsString } from 'class-validator';

import {
  IsEqualTo,
  IsStrongPassword,
} from 'src/common/decorators/validator.decorator';

export class ResetPasswordRequest {
  @IsString()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsEqualTo('password')
  confirmPassword: string;
}
