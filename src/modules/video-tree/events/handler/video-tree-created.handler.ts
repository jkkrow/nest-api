import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { VideoTreeCreatedEvent } from '../impl/video-tree-created.event';

@EventsHandler(VideoTreeCreatedEvent)
export class VideoTreeCreatedHandler implements IEventHandler {
  handle(event: VideoTreeCreatedEvent) {
    Logger.log(JSON.stringify(event), 'VideoTreeCreatedEvent');
  }
}
