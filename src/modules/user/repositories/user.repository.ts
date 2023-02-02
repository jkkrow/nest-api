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
    return this.getMany<User>(query, options);
  }

  async findOne(options: FindUserOptions) {
    const query = this.getUserQuery();
    return this.getOne<User>(query, options);
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
