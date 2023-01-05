export const mockPlans = {
  total_items: 1,
  total_pages: 1,
  plans: [
    {
      id: 'P-5ML4271244454362WXNWU5NQ',
      product_id: 'PROD-XXCD1234QWER65782',
      status: 'ACTIVE',
      name: 'Zoho Marketing Campaign  Plan',
      description: 'Zoho Marketing Campaign Plan',
      create_time: '2018-12-10T21:20:49Z',
      links: [
        {
          href: 'https://api-m.paypal.com/v1/billing/plans/P-5ML4271244454362WXNWU5NQ',
          rel: 'self',
          method: 'GET',
        },
      ],
    },
  ],
  links: [
    {
      href: 'https://api-m.paypal.com/v1/billing/plans?product_id=PROD-XXCD1234QWER65782&page_size=2&page=1',
      rel: 'self',
      method: 'GET',
    },
  ],
};

export const mockSubscription = {
  id: 'I-BW452GLLEP1G',
  status: 'APPROVAL_PENDING',
  status_update_time: '2018-12-10T21:20:49Z',
  plan_id: 'P-5ML4271244454362WXNWU5NQ',
  plan_overridden: false,
  start_time: '2018-11-01T00:00:00Z',
  quantity: '20',
  shipping_amount: {
    currency_code: 'USD',
    value: '10.00',
  },
  subscriber: {
    name: {
      given_name: 'John',
      surname: 'Doe',
    },
    email_address: 'customer@example.com',
    payer_id: '2J6QB8YJQSJRJ',
    shipping_address: {
      name: {
        full_name: 'John Doe',
      },
      address: {
        address_line_1: '2211 N First Street',
        address_line_2: 'Building 17',
        admin_area_2: 'San Jose',
        admin_area_1: 'CA',
        postal_code: '95131',
        country_code: 'US',
      },
    },
  },
  create_time: '2018-12-10T21:20:49Z',
  links: [
    {
      href: 'https://www.paypal.com/webapps/billing/subscriptions?ba_token=BA-2M539689T3856352J',
      rel: 'approve',
      method: 'GET',
    },
  ],
};
