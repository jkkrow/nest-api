export const VIDEO_TREE_STATUS = {
  PUBLIC: 'public',
  PRIVATE: 'private',
} as const;

export type VideoTreeStatus =
  typeof VIDEO_TREE_STATUS[keyof typeof VIDEO_TREE_STATUS];
