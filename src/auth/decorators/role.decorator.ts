import { SetMetadata } from '@nestjs/common';

import { RoleName, ROLE_KEY } from '../constants/role.constant';

export const Role = (role: RoleName) => SetMetadata(ROLE_KEY, role);
