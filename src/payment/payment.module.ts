import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { PaymentService } from './services/payment.service';
import { ConfigService } from 'src/config/services/config.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseURL: config.get('PAYPAL_API_URL'),
      }),
    }),
  ],
  providers: [PaymentService],
})
export class PaymentModule {}
