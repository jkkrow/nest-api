import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from 'src/database/repositories/database.repository';
import { UserFactory } from '../factories/user.factory';
import { UserEntity } from '../entities/user.entity';
import { User } from '../../user.model';
import { ICreateUserParams } from '../../interfaces/user.interface';

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
    return this.findOne({ id });
  }

  findByEmail(email: string) {
    return this.findOne({ email });
  }

  createUser(params: ICreateUserParams) {
    return this.create(params);
  }

  updateUser(id: string, user: User) {
    return this.update({ id }, user);
  }

  deleteUser(id: string) {
    return this.delete({ id });
  }
}
