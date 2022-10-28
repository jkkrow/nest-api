import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { UserCreatedEvent } from '../impl/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler {
  handle(event: UserCreatedEvent) {
    Logger.log('UserCreatedEvent', JSON.stringify(event, null, 2));
  }
}
