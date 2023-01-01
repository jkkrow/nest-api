import { Seeder, Factory } from 'typeorm-seeding';

import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserContext } from '../factories/user.factory';

export default class CreateUsers implements Seeder {
  async run(factory: Factory) {
    await factory<UserEntity, UserContext>(UserEntity)().createMany(10);
  }
}
