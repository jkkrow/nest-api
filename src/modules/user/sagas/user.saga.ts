import { Injectable, Logger } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable, map } from 'rxjs';

import { UserCreatedEvent } from '../events/impl/user-created.event';
import { SendVerificationCommand } from '../commands/impl/send-verification.command';

@Injectable()
export class UserSaga {
  @Saga()
  userCreated = (event$: Observable<any>) => {
    return event$.pipe(
      ofType(UserCreatedEvent),
      map(({ type, email }) => {
        if (type !== 'native') return;
        Logger.log(
          'UserCreatedEvent triggers SendVerificationCommand',
          'UserSaga',
        );
        return new SendVerificationCommand(email);
      }),
    );
  };
}
