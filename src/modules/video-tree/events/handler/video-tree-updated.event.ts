import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { VideoTreeUpdatedEvent } from '../impl/video-tree-updated.event';

@EventsHandler(VideoTreeUpdatedEvent)
export class VideoTreeUpdatedHandler implements IEventHandler {
  handle(event: VideoTreeUpdatedEvent) {
    Logger.log(JSON.stringify(event), 'VideoTreeUpdatedEvent');
  }
}
