import { Injectable, Logger } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable, filter, map, tap } from 'rxjs';

import { VideoTreeDeletedEvent } from '../events/impl/video-tree-deleted.event';
import { VideoNodeDeletedEvent } from '../events/impl/video-node-deleted.event';

@Injectable()
export class VideoTreeSaga {
  // @Saga()
  // videoTreeDeleted = (event$: Observable<any>) => {
  //   return event$.pipe(
  //     ofType(VideoTreeDeletedEvent),
  //     // map(({ id, userId }) => new DeleteVideoFileCommand(id, userId)),
  //     tap(() =>
  //       Logger.log(
  //         'VideoTreeDeletedEvent triggered DeleteVideoFileCommand',
  //         'VideoTreeSaga',
  //       ),
  //     ),
  //   );
  // };
  // @Saga()
  // videoNodeDeleted = (event$: Observable<any>) => {
  //   return event$.pipe(
  //     ofType(VideoNodeDeletedEvent),
  //     filter(({ url }) => url.length > 0),
  //     // map(({ url }) => new DeleteVideoFileCommand(url)),
  //     tap(() =>
  //       Logger.log(
  //         'VideoNodeDeletedEvent triggered DeleteVideoFileCommand',
  //         'VideoTreeSaga',
  //       ),
  //     ),
  //   );
  // };
}
