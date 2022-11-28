import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'channels',
  expression: `
    SELECT users.id AS id,
           name, 
           picture, 
           COUNT(DISTINCT subscriber_id) AS subscribers
    FROM users
    JOIN subscriptions ON subscriptions.publisher_id = users.id
    GROUP BY users.id
  `,
})
export class ChannelEntity {
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
