import { SetMetadata } from '@nestjs/common';

import { IRole, ROLE_KEY } from '../interfaces/role.interface';

export const Role = (role: IRole) => SetMetadata(ROLE_KEY, role);
