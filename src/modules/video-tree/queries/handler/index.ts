import { WatchVideoTreeHandler } from './watch-video-tree.handler';
import { GetVideoTreesHandler } from './get-video-trees.handler';
import { GetCreatedVideoTreesHandler } from './get-created-video-trees.handler';
import { GetCreatedVideoTreeHandler } from './get-created-video-tree.handler';
import { GetFavoritedVideoTreesHandler } from './get-favorited-video-trees.handler';
import { GetWatchedVideoTreesHandler } from './get-watched-video-trees..handler';
import { GetChannelVideoTreesHandler } from './get-channel-video-trees.handler';

export const QueryHandlers = [
  WatchVideoTreeHandler,
  GetVideoTreesHandler,
  GetCreatedVideoTreesHandler,
  GetCreatedVideoTreeHandler,
  GetFavoritedVideoTreesHandler,
  GetWatchedVideoTreesHandler,
  GetChannelVideoTreesHandler,
];
