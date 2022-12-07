import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { VideoNodeDeletedEvent } from '../impl/video-node-deleted.event';

@EventsHandler(VideoNodeDeletedEvent)
export class VideoNodeDeletedHandler implements IEventHandler {
  handle(event: VideoNodeDeletedEvent) {
    Logger.log(JSON.stringify(event), 'VideoNodeDeletedEvent');
  }
}
