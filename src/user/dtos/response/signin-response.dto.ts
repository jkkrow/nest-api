import { Expose, Type } from 'class-transformer';

import { UserDto } from '../user.dto';

export class SigninResponseDto {
  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  refreshToken: string;

  @Expose()
  accessToken: string;
}
