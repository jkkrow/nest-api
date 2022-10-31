import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigService } from 'src/config/config.service';

type TokenType = 'verification' | 'recovery' | 'refresh' | 'access';
type TokenExp = '7d' | '1d' | '1h' | '15m';

interface JwtPayload {
  userId: string;
  type: TokenType;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  signToken(userId: string, type: TokenType, exp: TokenExp) {
    return this.jwtService.sign(
      {
        userId,
        type,
      },
      {
        secret: this.config.get('JWT_KEY'),
        expiresIn: exp,
      },
    );
  }

  verifyToken(token: string, type?: TokenType) {
    try {
      const result = this.jwtService.verify<JwtPayload>(token, {
        secret: this.config.get('JWT_KEY'),
      });

      if (type && type !== result.type) {
        throw new Error();
      }

      return result;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
