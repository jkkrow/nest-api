export interface GetAccessToken {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
}

export interface ListPlans {
  plans: Plan[];
  total_items: number;
  total_pages: number;
  links: LinkDescription[];
}

export interface GetSubscription {
  id: string;
  custom_id: string;
  plan: Plan;
  plan_id: string;
  plan_overridden: boolean;
  quantity: string;
  billing_info: SubscriptionBillingInfo;
  subscriber: Subscriber;
  shipping_amount: Money;
  status: SubscriptionStatus;
  status_change_note: string;
  status_update_time: DateTime;
  links: LinkDescription[];
  start_time: DateTime;
  create_time: DateTime;
  update_time: DateTime;
}

export interface CreateSubscription {
  id: string;
  custom_id: string;
  plan: Plan;
  plan_id: string;
  plan_overridden: boolean;
  quantity: string;
  billing_info: SubscriptionBillingInfo;
  subscriber: Subscriber;
  shipping_amount: Money;
  status: SubscriptionStatus;
  status_change_note: string;
  status_change_time: DateTime;
  links: LinkDescription[];
  start_time: DateTime;
  create_time: DateTime;
  update_time: DateTime;
}

export interface CancelSubscription {}

export interface VerifyWebhookSignature {
  verification_status: VerificationStatus;
}

export interface WebhookSignatureBody {
  id: string;
  create_time: DateTime;
  resource_type: string;
  event_version: string;
  event_type: EventType;
  summary: string;
  resource: Resource;
  links: LinkDescription[];
}

export interface WebhookSignatureHeaders {
  'paypal-auth-algo': string;
  'paypal-cert-url': string;
  'paypal-transmission-id': string;
  'paypal-transmission-sig': string;
  'paypal-transmission-time': string;
}

export interface Plan {
  id: string;
  product_id: string;
  name: string;
  description: string;
  status: PlanStatus;
  billing_cycles: BillingCycle[];
  payment_preferences: PaymentPreferences;
  quantity_supported: boolean;
  taxes: Taxes;
  links: LinkDescription[];
  create_time: DateTime;
  update_time: DateTime;
}

export interface BillingCycle {
  frequency: Frequency;
  sequence: number;
  tenure_type: TenureType;
  pricing_scheme: PricingScheme;
  total_cycles: number;
}

export interface SubscriptionBillingInfo {
  failed_payments_count: number;
  outstanding_balance: Money;
  cycle_executions: CycleExecution[];
  final_payment_time: DateTime;
  last_failed_payment: FailedPaymentDetails;
  last_payment: LastPaymentDetails;
  next_billing_time: DateTime;
}

export interface AddressPortable {
  country_code: string;
  address_details: AddressDetails;
  address_line_1: string;
  address_line_2: string;
  address_line_3: string;
  admin_line_1: string;
  admin_line_2: string;
  admin_line_3: string;
  admin_line_4: string;
  postal_code: string;
}

export interface AddressDetails {
  building_name: string;
  delivery_service: string;
  street_name: string;
  street_number: string;
  street_type: string;
  sub_building: string;
}

export interface Subscriber {
  email_address: string;
  name: Name;
  payer_id: string;
  phone: PhoneWithType;
  payment_source: PaymentSource;
  shipping_address: ShippingDetail;
}

export interface PaymentSource {
  card: CardWithBillingAddress;
}

export interface Frequency {
  interval_unit: IntervalUnit;
  interval_count: number;
}

export interface PricingScheme {
  fixed_price: Money;
  pricing_model: PricingModel;
  tiers: PricingTier[];
  create_time: DateTime;
  update_time: DateTime;
  version: number;
}

export interface PricingTier {
  amount: Money;
  starting_quantity: string;
  ending_quantity: string;
}

export interface ShippingDetail {
  address: {
    country_code: string;
    address_line_1: string;
    address_line_2: string;
    admin_area_1: string;
    admin_area_2: string;
    postal_code: string;
  };
  name: {
    full_name: string;
  };
}

export interface Money {
  currency_code: string;
  value: string;
}

export interface Name {
  full_name: string;
  given_name: string;
  middle_name: string;
  prefix: string;
  suffix: string;
  surname: string;
}

export interface CardWithBillingAddress {
  type: string;
  name: string;
  brand: CardBrand;
  last_digits: string;
  billling_address: AddressPortable;
}

export interface PhoneWithType {
  phone_type: PhoneType;
  phone_number: {
    national_number: string;
  };
}

export interface FailedPaymentDetails {
  amount: Money;
  time: DateTime;
  next_payment_retry_time: number;
  reason_code: ReasonCode;
}

export interface LastPaymentDetails {
  status: string;
  amount: Money;
  time: DateTime;
}

export interface CycleExecution {
  cycles_completed: number;
  sequence: number;
  tenure_type: TenureType;
  current_pricing_scheme_version: number;
  cycles_remaining: number;
  total_cycles: number;
}

export interface LinkDescription {
  href: string;
  rel: string;
  method: Method;
}

export interface Taxes {
  percentage: string;
  inclusive: boolean;
}

export interface PaymentPreferences {
  auto_bill_outstanding: boolean;
  payment_failure_threshold: number;
  setup_fee: Money;
  setup_fee_failure_action: SetupFeeFailureAction;
}

export interface Resource {
  id: string;
  state: string;
  create_time: DateTime;
  update_time: DateTime;
  amount: ResourceAmount;
  parent_payment: string;
  valid_until: DateTime;
  links: LinkDescription[];
}

export interface ResourceAmount {
  total: string;
  currency: string;
  details: {
    subtotal: string;
  };
}

export type DateTime = string;

export type TenureType = 'REGULAR' | 'TRIAL';

export type IntervalUnit = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export type PricingModel = 'VOLUME' | 'TIERED';

export type PlanStatus = 'CREATED' | 'INACTIVE' | 'ACTIVE';

export type SetupFeeFailureAction = 'CONTINUE' | 'CANCEL';

export type PhoneType = 'FAX' | 'HOME' | 'MOBILE' | 'OTHER' | 'PAGER';

export type VerificationStatus = 'SUCCESS' | 'FAILURE';

export type Method =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'HEAD'
  | 'CONNECT'
  | 'OPTIONS'
  | 'PATCH';

export type SubscriptionStatus =
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'CANCELLED'
  | 'EXPIRED';

export type ReasonCode =
  | 'PAYMENT_DENIED'
  | 'INTERNAL_SERVER_ERROR'
  | 'PAYEE_ACCOUNT_RESTRICTED'
  | 'PAYER_ACCOUNT_RESTRICTED'
  | 'PAYER_CANNOT_PAY'
  | 'SENDING_LIMIT_EXCEEDED'
  | 'TRANSACTION_RECEIVING_LIMIT_EXCEEDED'
  | 'CURRENCY_MISMATCH';

export type CardBrand =
  | 'VISA'
  | 'MASTERCARD'
  | 'DISCOVER'
  | 'AMEX'
  | 'SOLO'
  | 'JCB'
  | 'STAR'
  | 'DELTA'
  | 'SWITCH'
  | 'MAESTRO'
  | 'CB_NATIONALE'
  | 'CONFIGOGA'
  | 'CONFIDIS'
  | 'ELECTRON'
  | 'CETELEM'
  | 'CHIAN_UNION_PAY';

export type EventType =
  | 'PAYMENT.SALE.COMPLETED'
  | 'PAYMENT.SALE.DENIED'
  | 'PAYMENT.SALE.PENDING'
  | 'PAYMENT.SALE.REFUNDED'
  | 'PAYMENT.SALE.REVERSED'
  | 'BILLING.SUBSCRIPTION.CREATED'
  | 'BILLING.SUBSCRIPTION.ACTIVATED'
  | 'BILLING.SUBSCRIPTION.UPDATED'
  | 'BILLING.SUBSCRIPTION.EXPIRED'
  | 'BILLING.SUBSCRIPTION.CANCELLED'
  | 'BILLING.SUBSCRIPTION.SUSPENDED'
  | 'BILLING.SUBSCRIPTION.PAYMENT.FAILED';
