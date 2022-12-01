import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { ConfigService } from 'src/config/services/config.service';
import {
  GetAccessToken,
  ListPlans,
  GetSubscription,
  CreateSubscription,
  CancelSubscription,
  VerifyWebhookSignature,
  WebhookBody,
  WebhookHeaders,
} from '../interfaces/payment.interface';

@Injectable()
export class PaymentService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private async getAccessToken() {
    const username = this.config.get('PAYPAL_CLIENT_ID');
    const password = this.config.get('PAYPAL_APP_SECRET');

    const { data } = await this.httpService.axiosRef<GetAccessToken>({
      url: '/v1/oauth2/token',
      method: 'post',
      data: 'grant_type=client_credentials',
      auth: { username, password },
    });

    return data.access_token;
  }

  async listPlans() {
    const accessToken = await this.getAccessToken();
    const { data } = await this.httpService.axiosRef<ListPlans>({
      url: '/v1/billing/plans',
      method: 'get',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data.plans;
  }

  async getPlan(name: string) {
    const plans = await this.listPlans();
    const plan = plans.find((p) => p.name.toLowerCase() === name.toLowerCase());

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return plan;
  }

  async getSubscription(id: string) {
    const accessToken = await this.getAccessToken();
    const { data } = await this.httpService.axiosRef<GetSubscription>({
      url: `/v1/billing/subscriptions/${id}`,
      method: 'get',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!data) {
      throw new NotFoundException('Subscription not found');
    }

    return data;
  }

  async createSubscription(planName: string, userId: string) {
    const accessToken = await this.getAccessToken();
    const plan = await this.getPlan(planName);
    const { data } = await this.httpService.axiosRef<CreateSubscription>({
      url: '/v1/billing/subscriptions',
      method: 'post',
      data: { plan_id: plan.id, custom_id: userId },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  }

  async cancelSubscription(id: string, reason?: string) {
    const accessToken = await this.getAccessToken();
    const { data } = await this.httpService.axiosRef<CancelSubscription>({
      url: `/v1/billing/subscriptions/${id}/cancel`,
      method: 'post',
      data: { reason: reason || 'No reason' },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  }

  async verifyWebhookSignature(body: WebhookBody, headers: WebhookHeaders) {
    const accessToken = await this.getAccessToken();
    const { data } = await this.httpService.axiosRef<VerifyWebhookSignature>({
      url: '/v1/notifications/verify-webhook-signature',
      method: 'post',
      data: {
        webhook_event: body,
        webhook_id: this.config.get('PAYPAL_WEBHOOK_ID'),
        auth_algo: headers['paypal-auth-algo'],
        cert_url: headers['paypal-cert-url'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (data.verification_status !== 'SUCCESS') {
      throw new BadRequestException('Invalid webhook signature');
    }

    return data;
  }
}
