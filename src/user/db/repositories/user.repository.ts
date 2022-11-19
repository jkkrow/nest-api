import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from 'src/database/repositories/database.repository';
import { UserFactory } from '../factories/user.factory';
import { UserEntity } from '../entities/user.entity';
import { User } from '../../models/user.model';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity, User> {
  constructor(
    @InjectRepository(UserEntity)
    readonly repository: Repository<UserEntity>,
    readonly userFactory: UserFactory,
  ) {
    super(repository, userFactory);
  }

  findById(id: string) {
    return this._findOne({ id });
  }

  findByEmail(email: string) {
    return this._findOne({ email });
  }

  save(user: User) {
    return this._save(user);
  }

  delete(user: User) {
    return this._delete(user);
  }
}
