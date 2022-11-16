import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

import { IsEqualTo } from 'src/common/decorators/match.decorator';

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
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  @MaxLength(50)
  @IsEqualTo('password')
  confirmPassword: string;
}
