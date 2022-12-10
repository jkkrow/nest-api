import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { VideoTreeWatchedEvent } from '../impl/video-tree-watched.event';

@EventsHandler(VideoTreeWatchedEvent)
export class VideoTreeWatchedHandler implements IEventHandler {
  handle(event: VideoTreeWatchedEvent) {
    Logger.log(JSON.stringify(event), 'VideoTreeWatchedEvent');
  }
}
