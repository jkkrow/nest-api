import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { ServerClient } from 'postmark';

import { ConfigService } from 'src/config/config.service';
import { CreateBounceDto } from './dtos/create-bounce.dto';
import { BounceEntity } from './db/entities/bounce.entity';

export class EmailService {
  constructor(
    @InjectRepository(BounceEntity)
    private readonly bounceRepository: Repository<BounceEntity>,
    private readonly config: ConfigService,
  ) {}

  private readonly client = new ServerClient(
    this.config.get('EMAIL_SERVER_API_TOKEN'),
  );

  async sendEmail(options: {
    from: string;
    to: string;
    subject: string;
    message: string;
    messageStream?: string;
  }) {
    await this.checkBounce(options.to);
    const sender = this.config.get('EMAIL_FROM');

    return this.client.sendEmail({
      From: sender.replace('@', options.from + '@'),
      To: options.to,
      Subject: options.subject,
      HtmlBody: options.message,
      MessageStream: options.messageStream,
    });
  }

  async sendEmailWithTemplate(options: {
    from: string;
    to: string;
    templateAlias: string;
    templateModel: object;
    messageStream?: string;
  }) {
    await this.checkBounce(options.to);
    const sender = this.config.get('EMAIL_FROM');

    return this.client.sendEmailWithTemplate({
      From: sender.replace('@', options.from + '@'),
      To: options.to,
      TemplateAlias: options.templateAlias,
      TemplateModel: options.templateModel,
      MessageStream: options.messageStream,
    });
  }

  createBounce(createBounceDto: CreateBounceDto) {
    const bounce = this.bounceRepository.create(createBounceDto);
    return this.bounceRepository.save(bounce);
  }

  async deleteBounce(email: string) {
    const bounce = await this.bounceRepository.findOneBy({ email });

    if (!bounce) {
      throw new NotFoundException('Bounce not found');
    }

    return await this.bounceRepository.remove(bounce);
  }

  async checkBounce(email: string) {
    const bounce = await this.bounceRepository.findOneBy({ email });

    if (bounce) {
      throw new NotFoundException('Invalid email: Bounced');
    }

    return;
  }
}
