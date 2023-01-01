import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';

import { UserEntity } from 'src/modules/user/entities/user.entity';

export interface UserContext {
  type?: UserEntity['type'];
  verified?: boolean;
  admin?: boolean;
  membership?: UserEntity['membership'];
}

define<UserEntity, UserContext>(UserEntity, (_, context) => {
  const user = new UserEntity();

  const { type, verified, admin, membership } = context ?? {
    type: 'native',
    verified: true,
    admin: false,
    membership: null,
  };

  user.id = faker.datatype.uuid();
  user.type = type ?? 'native';
  user.name = faker.internet.userName();
  user.email = faker.internet.email();
  user.password = faker.internet.password();
  user.picture = faker.image.avatar();
  user.verified = verified ?? true;
  user.admin = admin ?? false;
  user.membership = membership ?? null;

  return user;
});
