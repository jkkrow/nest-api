import { Injectable, BadRequestException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

import { ConfigService } from 'src/config/services/config.service';

@Injectable()
export class OAuthService {
  public readonly client: OAuth2Client;
  private readonly clientId: string;

  constructor(private readonly config: ConfigService) {
    const clientId = this.config.get('GOOGLE_CLIENT_ID');

    this.clientId = clientId;
    this.client = new OAuth2Client(clientId);
  }

  async verifyToken(token: string) {
    const result = await this.client.verifyIdToken({
      idToken: token,
      audience: this.clientId,
    });

    const payload = result.getPayload();

    if (
      !payload ||
      !payload.email_verified ||
      !payload.name ||
      !payload.email
    ) {
      throw new BadRequestException('Google account not verified');
    }

    return {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };
  }
}
