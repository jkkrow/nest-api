import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { ConfigService } from 'src/config/config.service';
import { AuthService } from 'src/auth/services/auth.service';
import { EmailService } from 'src/email/email.service';
import { From } from 'src/email/constants/from.constant';
import { Template } from 'src/email/constants/template.constant';
import { SendVerificationCommand } from '../impl/send-verification.command';
import { UserRepository } from '../../db/repositories/user.repository';

@CommandHandler(SendVerificationCommand)
export class SendVerificationHandler
  implements ICommandHandler<SendVerificationCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
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
    const token = this.authService.signToken(user.id, 'verification', '1d');
    const actionUrl = `${clientUrl}/auth/verification/${token}`;
    const retryUrl = `${clientUrl}/user/account`;

    await this.emailService.sendEmailWithTemplate({
      from: From.Auth,
      to: email,
      template: Template.AccountVerification,
      templateModel: { actionUrl, retryUrl },
    });
  }
}
