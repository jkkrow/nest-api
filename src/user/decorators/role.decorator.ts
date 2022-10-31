import { SetMetadata } from '@nestjs/common';

import { Role, ROLES_KEY } from '../interfaces/role.interface';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
