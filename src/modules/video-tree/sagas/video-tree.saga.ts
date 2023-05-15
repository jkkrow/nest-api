import { Injectable, Logger } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable, filter, map, tap } from 'rxjs';

import { VideoTreeWatchedEvent } from '../events/impl/video-tree-watched.event';
import { VideoNodeUpdatedEvent } from '../events/impl/video-node-updated.event';
import { AddViewCommand } from '../commands/impl/add-view.command';
import { UpdateVideoTreeCommand } from '../commands/impl/update-video-tree.command';

@Injectable()
export class VideoTreeSaga {
  @Saga()
  videoTreeWatched = (event$: Observable<VideoTreeWatchedEvent>) => {
    return event$.pipe(
      ofType(VideoTreeWatchedEvent),
      map(({ id, ip, userId }) => new AddViewCommand(id, ip, userId)),
      tap(() =>
        Logger.log(
          'VideoTreeWatchedEvent triggered AddViewCommand',
          'VideoTreeSaga',
        ),
      ),
    );
  };

  @Saga()
  videoNodeThumbnailUpdated = (event$: Observable<VideoNodeUpdatedEvent>) => {
    return event$.pipe(
      ofType(VideoNodeUpdatedEvent),
      filter(({ meta, updates }) => meta.level === 0 && !!updates.thumbnail),
      map(({ meta, updates }) => {
        const { treeId, userId } = meta;
        const treeUpdates = { defaultThumbnail: updates.thumbnail };
        return new UpdateVideoTreeCommand(treeId, userId, treeUpdates);
      }),
      tap(() =>
        Logger.log(
          'Detected thumbnail update of root video node. VideoNodeUpdatedEvent triggered UpdateVideoTreeCommand',
          'VideoTreeSaga',
        ),
      ),
    );
  };

  // @Saga()
  // videoTreeDeleted = (event$: Observable<VideoTreeDeletedEvent>) => {
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
  // videoNodeDeleted = (event$: Observable<VideoNodeDeletedEvent>) => {
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
