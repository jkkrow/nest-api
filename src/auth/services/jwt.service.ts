import { Injectable } from '@nestjs/common';
import { JwtService as BaseJwtService } from '@nestjs/jwt';

import { UnauthorizedException } from 'src/common/exceptions';
import {
  JwtPayload,
  JwtResult,
  JwtSignOptions,
  JwtVerifyOptions,
} from '../interfaces/jwt.interface';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: BaseJwtService) {}

  sign(payload: JwtPayload, options: JwtSignOptions) {
    return this.jwtService.sign(payload, {
      expiresIn: options.exp,
      subject: options.sub,
    });
  }

  verify<T>(token: string, options?: JwtVerifyOptions) {
    const { sub, ignoreExp, errorMessage } = options || {};
    try {
      const result = this.jwtService.verify<T & JwtResult>(token, {
        subject: sub,
        ignoreExpiration: ignoreExp,
      });

      return result;
    } catch (err) {
      throw new UnauthorizedException(
        errorMessage || 'Invalid or expired token',
      );
    }
  }
}
