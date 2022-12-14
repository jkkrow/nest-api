import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from 'src/providers/database/models/database.repository';
import { UserEntity } from '../entities/user.entity';
import { User } from './user';
import { UserFactory } from './user.factory';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity, User> {
  constructor(
    @InjectRepository(UserEntity)
    readonly repository: Repository<UserEntity>,
    readonly factory: UserFactory,
  ) {
    super(repository, factory);
  }

  findOneById(id: string) {
    return this._findOne({ id });
  }

  findOneByEmail(email: string) {
    return this._findOne({ email });
  }

  save(user: User) {
    return this._save(user);
  }

  delete(user: User) {
    return this._delete(user);
  }
}
