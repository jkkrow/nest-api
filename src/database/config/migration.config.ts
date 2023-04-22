import { DataSource } from 'typeorm';

import { typeOrmConfig } from './database.config';
import { usersTable1668851144977 } from '../migrations/1668851144977-users-table';
import { membershipsTable1668851156524 } from '../migrations/1668851156524-memberships-table';
import { subscriptionsTable1668851169929 } from '../migrations/1668851169929-subscriptions-table';
import { bouncesTable1668851179916 } from '../migrations/1668851179916-bounces-table';
import { videoTreesTable1670387603272 } from '../migrations/1670387603272-video-trees-table';
import { videoNodesTable1670387789510 } from '../migrations/1670387789510-video-nodes-table';
import { videoNodesClosureTable1670387796711 } from '../migrations/1670387796711-video-nodes-closure-table';
import { categoriesTable1670388309261 } from '../migrations/1670388309261-categories-table';
import { categoriesVideoTreesTable1670388476297 } from '../migrations/1670388476297-categories-video-trees-table';
import { favoritesTable1670665265678 } from '../migrations/1670665265678-favorites-table';
import { viewsTable1670665276224 } from '../migrations/1670665276224-views-table';
import { historiesTable1670914526176 } from '../migrations/1670914526176-histories-table';
import { channelsView1671435720268 } from '../migrations/1671435720268-channels-view';
import { videoTreesFullTextSearch1672564973161 } from '../migrations/1672564973161-video-trees-full-text-search';
import { createTimestampsIndex1675252484543 } from '../migrations/1675252484543-create-timestamps-index';
import { updateVideoNodesTable1681204708836 } from '../migrations/1681204708836-update-video-nodes-table';
import { updateVideoTreesSearch1682150229606 } from '../migrations/1682150229606-update-video-trees-search';

export default new DataSource({
  ...typeOrmConfig,
  entities: [__dirname + '/../../**/*.entity.{ts,js}'],
  migrations: [
    usersTable1668851144977,
    membershipsTable1668851156524,
    subscriptionsTable1668851169929,
    bouncesTable1668851179916,
    videoTreesTable1670387603272,
    videoNodesTable1670387789510,
    videoNodesClosureTable1670387796711,
    categoriesTable1670388309261,
    categoriesVideoTreesTable1670388476297,
    favoritesTable1670665265678,
    viewsTable1670665276224,
    historiesTable1670914526176,
    channelsView1671435720268,
    videoTreesFullTextSearch1672564973161,
    createTimestampsIndex1675252484543,
    updateVideoNodesTable1681204708836,
    updateVideoTreesSearch1682150229606,
  ],
});
