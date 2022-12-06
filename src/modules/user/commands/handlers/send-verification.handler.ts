import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { NotFoundException, BadRequestException } from 'src/common/exceptions';
import { ConfigService } from 'src/config/services/config.service';
import { JwtService } from 'src/auth/services/jwt.service';
import { EmailService } from 'src/providers/email/services/email.service';
import { SendVerificationCommand } from '../impl/send-verification.command';
import { UserRepository } from '../../models/user.repository';

@CommandHandler(SendVerificationCommand)
export class SendVerificationHandler
  implements ICommandHandler<SendVerificationCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async execute({ email }: SendVerificationCommand) {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.verified) {
      throw new BadRequestException('User already has been verified');
    }

    const clientUrl = this.configService.get('CLIENT_URL');
    const token = this.jwtService.sign(user.id, {
      sub: 'verification',
      exp: '1d',
    });

    const actionUrl = `${clientUrl}/auth/verification/${token}`;
    const retryUrl = `${clientUrl}/user/account`;

    await this.emailService.sendEmailWithTemplate({
      from: 'auth',
      to: email,
      template: 'account-verification',
      templateModel: { actionUrl, retryUrl },
    });
  }
}
