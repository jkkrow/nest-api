import { CreateVideoTreeHandler } from './create-video-tree.handler';
import { UpdateVideoTreeHandler } from './update-video-tree.handler';
import { DeleteVideoTreeHandler } from './delete-video-tree.handler';
import { CreateVideoNodeHandler } from './create-video-node.handler';
import { UpdateVideoNodeHandler } from './update-video-node.handler';
import { DeleteVideoNodeHandler } from './delete-video-node.handler';

export const CommandHandlers = [
  CreateVideoTreeHandler,
  UpdateVideoTreeHandler,
  DeleteVideoTreeHandler,
  CreateVideoNodeHandler,
  UpdateVideoNodeHandler,
  DeleteVideoNodeHandler,
];
