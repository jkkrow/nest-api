import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

import { BadRequestException } from 'src/common/exceptions';

@Injectable()
export class EncryptService {
  async hash(password: string) {
    return await bcryptjs.hash(password, 12);
  }

  async verify(password: string, hash: string, message?: string) {
    const isValid = await bcryptjs.compare(password, hash);

    if (!isValid) {
      throw new BadRequestException(message);
    }
  }
}
