export const FROM = {
  AUTH: 'auth',
  SUPPORT: 'support',
  NOREPLY: 'noreply',
  TEST: 'test',
} as const;

export const TEMPLATE = {
  ACCOUNT_VERIFICATION: 'account-verification',
  ACCOUNT_DELETION: 'account-deletion',
  PASSWORD_RESET: 'password-reset',
  TEST: 'test',
} as const;

export type From = typeof FROM[keyof typeof FROM];
export type Template = typeof TEMPLATE[keyof typeof TEMPLATE];
