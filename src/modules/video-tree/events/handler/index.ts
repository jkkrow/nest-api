import { VideoTreeCreatedHandler } from './video-tree-created.handler';
import { VideoTreeDeletedHandler } from './video-tree-deleted.handler';
import { VideoNodeCreatedHandler } from './video-node-created.handler';
import { VideoNodeUpdatedHandler } from './video-node-updated.handler';
import { VideoNodeDeletedHandler } from './video-node-deleted.handler';

export const EventHandlers = [
  VideoTreeCreatedHandler,
  VideoTreeDeletedHandler,
  VideoNodeCreatedHandler,
  VideoNodeUpdatedHandler,
  VideoNodeDeletedHandler,
];
