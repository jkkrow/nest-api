import { Expose, Type } from 'class-transformer';

import { UserDto } from '../user.dto';

export class GetUserResponseDto {
  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}
