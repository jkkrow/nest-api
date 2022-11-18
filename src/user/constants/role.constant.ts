export const ROLE_KEY = 'role';

export const ROLE_NAME = {
  VERIFIED: 'verified',
  MEMBER: 'member',
  ADMIN: 'admin',
} as const;

export type RoleName = typeof ROLE_NAME[keyof typeof ROLE_NAME];
