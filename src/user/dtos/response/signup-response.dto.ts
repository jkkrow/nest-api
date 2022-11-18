import { Expose, Type } from 'class-transformer';

import { UserDto } from '../user.dto';

export class SignupResponseDto {
  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  refreshToken: string;

  @Expose()
  accessToken: string;

  @Expose()
  message: string;
}
