import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { UserUpdatedEvent } from '../impl/user-updated.event';

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedHandler implements IEventHandler {
  handle(event: UserUpdatedEvent) {
    const result = {
      id: event.id,
      updates: Object.keys(event.updates),
    };
    Logger.log(JSON.stringify(result), 'UserUpdatedEvent');
  }
}
