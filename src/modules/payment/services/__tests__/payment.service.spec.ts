import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';

import { ConfigService } from 'src/config/services/config.service';
import { PaymentService } from '../payment.service';
import { Plan } from '../../interfaces/payment.interface';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let httpService: HttpService;

  const fakeHttpService = {
    axiosRef: jest.fn().mockResolvedValue({ data: {} }),
  };

  const fakeConfigService = {
    get: jest.fn().mockReturnValue('mock'),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: HttpService, useValue: fakeHttpService },
        { provide: ConfigService, useValue: fakeConfigService },
      ],
    }).compile();

    paymentService = module.get(PaymentService);
    httpService = module.get(HttpService);

    const getAccessToken = jest.spyOn(paymentService as any, 'getAccessToken');
    getAccessToken.mockReturnValue('testAccessToken');
  });

  describe('listPlans', () => {
    it('should return plans', async () => {
      const axiosRef = jest.spyOn(httpService, 'axiosRef');
      axiosRef.mockResolvedValue({ data: { plans: [{}] } });

      const plans = await paymentService.listPlans();

      expect(plans.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getPlan', () => {
    it('should be failed if no plan was found', async () => {
      const listPlans = jest.spyOn(paymentService, 'listPlans');
      listPlans.mockResolvedValue([]);

      const getPlanPromise = paymentService.getPlan('planName');

      await expect(getPlanPromise).rejects.toThrow();
    });

    it('should return a plan', async () => {
      const listPlans = jest.spyOn(paymentService, 'listPlans');
      listPlans.mockResolvedValue([{ id: 'p1', name: 'plan' }] as Plan[]);

      const plan = await paymentService.getPlan('plan');

      expect(plan).toBeDefined();
    });
  });

  describe('getSubscription', () => {
    it('should be failed if no subscription was found', async () => {
      const axiosRef = jest.spyOn(httpService, 'axiosRef');
      axiosRef.mockResolvedValue({ data: undefined });

      const getSubscriptionPromise = paymentService.getSubscription('test');

      await expect(getSubscriptionPromise).rejects.toThrow();
    });

    it('should return a subscription', async () => {
      const axiosRef = jest.spyOn(httpService, 'axiosRef');
      axiosRef.mockResolvedValue({ data: { id: 's1' } });

      const subscription = await paymentService.getSubscription('s1');

      expect(subscription).toBeDefined();
    });
  });

  describe('createSubscription', () => {
    it('should create a new subscription', async () => {
      const axiosRef = jest.spyOn(httpService, 'axiosRef');
      const getPlan = jest.spyOn(paymentService, 'getPlan');
      axiosRef.mockResolvedValue({ data: { id: 's1', plan_id: 'p1' } });
      getPlan.mockResolvedValue({ id: 'p1', product_id: 'P1' } as Plan);

      const subscription = await paymentService.createSubscription('p1', 'u1');

      expect(subscription).toBeDefined();
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should be failed with invalid signature', async () => {
      const axiosRef = jest.spyOn(httpService, 'axiosRef');
      const data = { verification_status: 'FAILURE' };
      axiosRef.mockResolvedValue({ data });

      const verfiyPromise = paymentService.verifyWebhookSignature(
        {} as any,
        {} as any,
      );

      await expect(verfiyPromise).rejects.toThrow();
    });
  });
});
