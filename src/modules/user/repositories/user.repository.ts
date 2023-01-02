import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from 'src/providers/database/repositories/database.repository';
import { FindOptions } from 'src/providers/database/types/database.type';
import { UserEntity } from '../entities/user.entity';
import { User } from '../interfaces/user.interface';

interface FindUserOptions extends FindOptions<UserEntity, ''> {}

@Injectable()
export class UserRepository extends BaseRepository<
  UserEntity,
  FindUserOptions
> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super('users');
  }

  async find(options: FindUserOptions) {
    const query = this.getUserQuery();
    const findQuery = this.filterQuery(query, options);

    const [users, count] = await Promise.all([
      findQuery.getMapMany<User>(),
      findQuery.getCount(),
    ]);

    return { users, count };
  }

  async findOne(options: FindUserOptions) {
    const query = this.getUserQuery();
    const findQuery = this.filterQuery(query, options);

    return await findQuery.getMapOne<User>();
  }

  private getUserQuery() {
    // Alias
    const user = this.alias;
    const membership = 'u_membership';

    const query = this.repository
      .createQueryBuilder(user)
      .leftJoinAndSelect(`${user}.membership`, membership);

    return query;
  }
}
