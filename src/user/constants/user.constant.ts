export const USER_TYPE = {
  NATIVE: 'native',
  GOOGLE: 'google',
} as const;

export const MEMBERSHIP_NAME = {
  STANDARD: 'standard',
  BUSINESS: 'business',
  ENTERPRISE: 'enterprise',
} as const;

export type UserType = typeof USER_TYPE[keyof typeof USER_TYPE];
export type MembershipName =
  typeof MEMBERSHIP_NAME[keyof typeof MEMBERSHIP_NAME];
