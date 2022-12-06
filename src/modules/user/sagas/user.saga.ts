import { Injectable, Logger } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable, filter, map, tap } from 'rxjs';

import { UserCreatedEvent } from '../events/impl/user-created.event';
import { SendVerificationCommand } from '../commands/impl/send-verification.command';

@Injectable()
export class UserSaga {
  @Saga()
  userCreated = (event$: Observable<any>) => {
    return event$.pipe(
      ofType(UserCreatedEvent),
      filter(({ type }) => type === 'native'),
      map(({ email }) => new SendVerificationCommand(email)),
      tap(() =>
        Logger.log(
          'UserCreatedEvent triggered SendVerificationCommand',
          'UserSaga',
        ),
      ),
    );
  };
}
