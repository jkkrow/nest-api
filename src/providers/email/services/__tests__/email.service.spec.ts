import { Test } from '@nestjs/testing';

import { ConfigService } from 'src/config/services/config.service';
import { BounceService } from 'src/modules/bounce/services/bounce.service';
import { EmailService } from '../email.service';
import { From, Template } from '../../constants/email.constant';

jest.mock('postmark', () => ({
  ServerClient: jest.fn().mockReturnValue({
    sendEmail: jest.fn(),
    sendEmailWithTemplate: jest.fn(),
  }),
}));

describe('EmailService', () => {
  let emailService: EmailService;
  let bounceService: BounceService;

  const fakeConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'EMAIL_FROM':
          return 'Test <@example.com>';
        default:
          return 'mock';
      }
    }),
  };

  const fakeBounceService = {
    check: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: ConfigService, useValue: fakeConfigService },
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

      await emailService.sendEmail(options);

      const sender = defineSender.mock.results[0].value;
      expect(sender).toContain('@');
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

      await emailService.sendEmailWithTemplate(options);

      const sender = defineSender.mock.results[0].value;
      expect(sender).toContain('@');
    });
  });
});
