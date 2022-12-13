import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';

import { BadRequestException } from 'src/common/exceptions';
import { Bounce } from '../interfaces/bounces.interface';
import { BounceEntity } from '../entities/bounce.entity';

@Injectable()
export class BounceService {
  constructor(
    @InjectRepository(BounceEntity)
    private readonly repository: Repository<BounceEntity>,
  ) {}

  findOneByEmail(email: string) {
    return this.repository.findOneBy({ email });
  }

  create(bounce: Bounce) {
    return this.repository.insert(bounce);
  }

  delete(email: string) {
    return this.repository.delete({ email });
  }

  async check(email: string) {
    const bounce = await this.findOneByEmail(email);

    if (bounce) {
      throw new BadRequestException('Invalid email: Bounced');
    }

    return;
  }
}
