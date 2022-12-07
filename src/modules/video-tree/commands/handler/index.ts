import { CreateVideoTreeHandler } from './create-video-tree.handler';
import { CreateVideoNodeHandler } from './create-video-node.handler';
import { DeleteVideoNodeHandler } from './delete-video-node.handler';

export const CommandHandlers = [
  CreateVideoTreeHandler,
  CreateVideoNodeHandler,
  DeleteVideoNodeHandler,
];
