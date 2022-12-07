import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { VideoTreeDeletedEvent } from '../impl/video-tree-deleted.event';

@EventsHandler(VideoTreeDeletedEvent)
export class VideoTreeDeletedHandler implements IEventHandler {
  handle(event: VideoTreeDeletedEvent) {
    Logger.log(JSON.stringify(event), 'VideoTreeDeletedEvent');
  }
}
