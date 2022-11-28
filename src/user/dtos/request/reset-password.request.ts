import { IsString, MaxLength } from 'class-validator';

import {
  IsEqualTo,
  IsStrongPassword,
} from 'src/common/decorators/validator.decorator';

export class ResetPasswordRequest {
  @IsString()
  @MaxLength(50)
  @IsStrongPassword()
  password: string;

  @IsString()
  @MaxLength(50)
  @IsEqualTo('password')
  confirmPassword: string;
}
