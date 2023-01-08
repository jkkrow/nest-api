import { Test } from '@nestjs/testing';

import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/services/config.service';
import { BounceService } from 'src/modules/bounce/services/bounce.service';
import { EmailService } from '../email.service';
import { From, Template } from '../../constants/email.constant';

describe('EmailService', () => {
  let emailService: EmailService;
  let bounceService: BounceService;

  const fakeBounceService = {
    check: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        EmailService,
        ConfigService,
        { provide: BounceService, useValue: fakeBounceService },
      ],
    }).compile();

    emailService = module.get(EmailService);
    bounceService = module.get(BounceService);
  });

  describe('sendEmail', () => {
    const options = {
      from: 'test' as From,
      to: 'test@example.com',
      subject: 'Test',
      message: 'Test',
    };

    it('should check if email is bounced', async () => {
      const check = jest.spyOn(bounceService, 'check');

      await emailService.sendEmail(options);

      expect(check).toBeCalled();
    });

    it('should send email with valid sender', async () => {
      const defineSender = jest.spyOn(emailService as any, 'defineSender');

      const result = await emailService.sendEmail(options);
      const sender = defineSender.mock.results[0].value;

      expect(sender).toContain('@');
      expect(result.ErrorCode).toEqual(0);
      expect(result.Message).toEqual('OK');
    });
  });

  describe('sendEmailWithTemplate', () => {
    const options = {
      from: 'test' as From,
      to: 'test@example.com',
      template: 'test' as Template,
      templateModel: {},
    };

    it('should check if email is bounced', async () => {
      const check = jest.spyOn(bounceService, 'check');

      await emailService.sendEmailWithTemplate(options);

      expect(check).toBeCalled();
    });

    it('should send email with valid sender', async () => {
      const defineSender = jest.spyOn(emailService as any, 'defineSender');

      const result = await emailService.sendEmailWithTemplate(options);
      const sender = defineSender.mock.results[0].value;

      expect(sender).toContain('@');
      expect(result.ErrorCode).toEqual(0);
      expect(result.Message).toEqual('OK');
    });
  });
});
