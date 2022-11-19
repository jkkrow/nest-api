import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { UserDeletedEvent } from '../impl/user-deleted.event';

@EventsHandler(UserDeletedEvent)
export class UserDeletedHandler implements IEventHandler {
  handle(event: UserDeletedEvent) {
    Logger.log(JSON.stringify(event, null, 2), 'UserDeletedEvent');
  }
}
