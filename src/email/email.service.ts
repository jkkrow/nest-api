import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServerClient } from 'postmark';

import { ConfigService } from 'src/config/config.service';
import { CreateBounceDto } from './dtos/create-bounce.dto';
import { BounceSchema } from './schemas/bounce.schema';

export class EmailService {
  constructor(
    @InjectModel(BounceSchema.name)
    private readonly bounceModel: Model<BounceSchema>,
    private readonly configService: ConfigService,
  ) {}

  private readonly client = new ServerClient(
    this.configService.get('EMAIL_SERVER_API_TOKEN'),
  );

  async sendEmail(options: {
    from: string;
    to: string;
    subject: string;
    message: string;
    messageStream?: string;
  }) {
    await this.checkBounce(options.to);
    const sender = this.configService.get('EMAIL_FROM');

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
    const sender = this.configService.get('EMAIL_FROM');

    return this.client.sendEmailWithTemplate({
      From: sender.replace('@', options.from + '@'),
      To: options.to,
      TemplateAlias: options.templateAlias,
      TemplateModel: options.templateModel,
      MessageStream: options.messageStream,
    });
  }

  createBounce(createBounceDto: CreateBounceDto) {
    const bounce = new this.bounceModel(createBounceDto);
    return bounce.save();
  }

  async deleteBounce(Email: string) {
    const bounce = await this.bounceModel.findOne({ Email });

    if (!bounce) {
      throw new NotFoundException('Bounce not found');
    }

    return await bounce.remove();
  }

  async checkBounce(Email: string) {
    const bounce = await this.bounceModel.findOne({ Email });

    if (bounce) {
      throw new NotFoundException('Invalid email: Bounced');
    }

    return;
  }
}
