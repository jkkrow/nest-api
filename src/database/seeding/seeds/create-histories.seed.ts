import { Seeder, Factory } from 'typeorm-seeding';

import { HistoryEntity } from 'src/modules/history/entities/history.entity';
import { HistoryContext } from '../factories/history.factory';

export default class CreateHistories implements Seeder {
  async run(factory: Factory) {
    await factory<HistoryEntity, HistoryContext>(HistoryEntity)().createMany(
      100,
    );
  }
}
