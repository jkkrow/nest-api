export const TOKEN_SUB = {
  VERIFICATION: 'verification',
  RECOVERY: 'recovery',
  REFRESH: 'refresh',
  ACCESS: 'access',
} as const;

export const TOKEN_EXP = {
  VERIFICATION: '7d',
  RECOVERY: '1d',
  REFRESH: '1h',
  ACCESS: '15m',
} as const;

export type TokenSub = typeof TOKEN_SUB[keyof typeof TOKEN_SUB];
export type TokenExp = typeof TOKEN_EXP[keyof typeof TOKEN_EXP];
