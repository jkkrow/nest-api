import { Logger, Injectable } from '@nestjs/common';
import { Saga, ICommand, ofType } from '@nestjs/cqrs';
import { delay, map, Observable } from 'rxjs';

import { UserCreatedEvent } from '../events/impl/user-created.event';

@Injectable()
export class UserSaga {
  @Saga()
  userCreated = (event$: Observable<any>): Observable<ICommand> => {
    return event$.pipe(
      ofType(UserCreatedEvent),
      delay(1000),
      map((event) => {
        Logger.log('UsersSaga', JSON.stringify(event, null, 2));
        return null;
      }),
    );
  };
}
