import { VideoTreeCreatedHandler } from './video-tree-created.handler';
import { VideoNodeCreatedHandler } from './video-node-created.handler';
import { VideoNodeDeletedHandler } from './video-node-deleted.handler';

export const EventHandlers = [
  VideoTreeCreatedHandler,
  VideoNodeCreatedHandler,
  VideoNodeDeletedHandler,
];
