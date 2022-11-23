import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { RoleName, ROLE_KEY } from '../constants/role.constant';

export const Role = (role: RoleName) => {
  return applyDecorators(SetMetadata(ROLE_KEY, role), ApiBearerAuth());
};
