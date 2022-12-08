import { VideoTreeCreatedHandler } from './video-tree-created.handler';
import { VideoTreeUpdatedHandler } from './video-tree-updated.event';
import { VideoTreeDeletedHandler } from './video-tree-deleted.handler';
import { VideoNodeCreatedHandler } from './video-node-created.handler';
import { VideoNodeUpdatedHandler } from './video-node-updated.handler';
import { VideoNodeDeletedHandler } from './video-node-deleted.handler';

export const EventHandlers = [
  VideoTreeCreatedHandler,
  VideoTreeUpdatedHandler,
  VideoTreeDeletedHandler,
  VideoNodeCreatedHandler,
  VideoNodeUpdatedHandler,
  VideoNodeDeletedHandler,
];
