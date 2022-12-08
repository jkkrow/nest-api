import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { VideoNodeUpdatedEvent } from '../impl/video-node-updated.event';

@EventsHandler(VideoNodeUpdatedEvent)
export class VideoNodeUpdatedHandler implements IEventHandler {
  handle(event: VideoNodeUpdatedEvent) {
    Logger.log(JSON.stringify(event), 'VideoNodeUpdatedEvent');
  }
}
