import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { VideoNodeCreatedEvent } from '../impl/video-node-created.event';

@EventsHandler(VideoNodeCreatedEvent)
export class VideoNodeCreatedHandler implements IEventHandler {
  handle(event: VideoNodeCreatedEvent) {
    Logger.log(JSON.stringify(event), 'VideoNodeCreatedEvent');
  }
}
