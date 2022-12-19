import { ViewEntity, ViewColumn, PrimaryColumn, DataSource } from 'typeorm';

@ViewEntity({
  name: 'channels',
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('u.id', 'id')
      .addSelect('u.name', 'name')
      .addSelect('u.picture', 'picture')
      .addSelect('COUNT(DISTINCT v.id)', 'videos')
      .addSelect('COUNT(DISTINCT s.subscriber_id)', 'subscribers')
      .from('users', 'u')
      .leftJoin('video_trees', 'v', 'v.creator_id = u.id AND v.editing = FALSE')
      .leftJoin('subscriptions', 's', 's.publisher_id = u.id')
      .groupBy('u.id'),
})
export class ChannelEntity {
  @ViewColumn()
  @PrimaryColumn()
  id: string;

  @ViewColumn()
  name: string;

  @ViewColumn()
  picture: string;

  @ViewColumn()
  videos: number;

  @ViewColumn()
  subscribers: number;
}
