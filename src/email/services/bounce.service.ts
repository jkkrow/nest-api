import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';

import { CreateBounceRequest } from '../dtos/request/create-bounce.request';
import { BounceEntity } from '../db/entities/bounce.entity';

@Injectable()
export class BounceService {
  constructor(
    @InjectRepository(BounceEntity)
    private readonly repository: Repository<BounceEntity>,
  ) {}

  findOneByEmail(email: string) {
    return this.repository.findOneBy({ email });
  }

  create(params: CreateBounceRequest) {
    const bounce = this.repository.create(params);
    return this.repository.save(bounce);
  }

  delete(email: string) {
    return this.repository.delete({ email });
  }
}
