import { ViewEntity, ViewColumn } from 'typeorm';

import { IChannel } from '../interfaces/channel.interface';

@ViewEntity({
  name: 'channels',
  expression: `
    SELECT
      users.id AS id,
      users.name AS name,
      users.picture AS picture,
      COUNT(DISTINCT subscriptions.subscriber_id) AS subscribers
    FROM users
    LEFT JOIN subscriptions ON subscriptions.publisher_id = users.id
    GROUP BY users.id
  `,
})
export class ChannelEntity implements Omit<IChannel, 'subscribed'> {
  @ViewColumn()
  id: string;

  @ViewColumn()
  name: string;

  @ViewColumn()
  picture: string;

  @ViewColumn()
  subscribers: number;

  // @ViewColumn()
  // videos: number;
}
