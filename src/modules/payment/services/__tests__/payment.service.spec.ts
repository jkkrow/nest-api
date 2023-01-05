import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';

import { ConfigService } from 'src/config/services/config.service';
import { PaymentService } from '../payment.service';
import { Plan } from '../../interfaces/payment.interface';
import { mockPlans, mockSubscription } from '../__mocks__/payment.service.mock';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let httpService: HttpService;

  const fakeHttpService = {
    axiosRef: jest.fn().mockReturnValue({ data: {} }),
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
      axiosRef.mockReturnValueOnce(Promise.resolve({ data: mockPlans }));

      const plans = await paymentService.listPlans();

      expect(plans.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getPlan', () => {
    it('should be failed if no plan was found', async () => {
      const listPlans = jest.spyOn(paymentService, 'listPlans');
      listPlans.mockReturnValueOnce(Promise.resolve([]));

      const getPlanPromise = paymentService.getPlan('planName');

      await expect(getPlanPromise).rejects.toThrow();
    });

    it('should return a plan', async () => {
      const listPlans = jest.spyOn(paymentService, 'listPlans');
      listPlans.mockReturnValueOnce(Promise.resolve(mockPlans.plans as Plan[]));

      const planName = mockPlans.plans[0].name;
      const plan = await paymentService.getPlan(planName);

      expect(plan).toHaveProperty('id');
      expect(plan).toHaveProperty('product_id');
    });
  });

  describe('getSubscription', () => {
    it('should be failed if no subscription was found', async () => {
      const axiosRef = jest.spyOn(httpService, 'axiosRef');
      axiosRef.mockReturnValueOnce(Promise.resolve({ data: undefined }));

      const getSubscriptionPromise = paymentService.getSubscription('test');

      await expect(getSubscriptionPromise).rejects.toThrow();
    });

    it('should return a subscription', async () => {
      const axiosRef = jest.spyOn(httpService, 'axiosRef');
      axiosRef.mockReturnValueOnce(Promise.resolve({ data: mockSubscription }));

      const subscriptionId = mockSubscription.id;
      const subscription = await paymentService.getSubscription(subscriptionId);

      expect(subscription).toBeDefined();
    });
  });

  describe('createSubscription', () => {
    it('should create a new subscription', async () => {
      const axiosRef = jest.spyOn(httpService, 'axiosRef');
      const getPlan = jest.spyOn(paymentService, 'getPlan');
      axiosRef.mockReturnValueOnce(Promise.resolve({ data: mockSubscription }));
      getPlan.mockReturnValueOnce(Promise.resolve(mockPlans.plans[0] as Plan));

      const subscription = await paymentService.createSubscription(
        'planName',
        'userId',
      );

      expect(subscription).toHaveProperty('id');
      expect(subscription).toHaveProperty('plan_id');
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should be failed with invalid signature', async () => {
      const axiosRef = jest.spyOn(httpService, 'axiosRef');
      const data = { verification_status: 'FAILURE' };
      axiosRef.mockReturnValueOnce(Promise.resolve({ data }));

      const verfiyPromise = paymentService.verifyWebhookSignature(
        {} as any,
        {} as any,
      );

      await expect(verfiyPromise).rejects.toThrow();
    });
  });
});
