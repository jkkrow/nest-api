export const JWT_SUB = {
  VERIFICATION: 'verification',
  RECOVERY: 'recovery',
  REFRESH: 'refresh',
  ACCESS: 'access',
} as const;

export const JWT_EXP = {
  VERIFICATION: '7d',
  RECOVERY: '1d',
  REFRESH: '1h',
  ACCESS: '15m',
} as const;

export type JWTSub = typeof JWT_SUB[keyof typeof JWT_SUB];
export type JWTExp = typeof JWT_EXP[keyof typeof JWT_EXP];
