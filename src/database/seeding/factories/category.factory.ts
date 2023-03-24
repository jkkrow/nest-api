import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';

import { CategoryEntity } from 'src/modules/category/entities/category.entity';

export interface CategoryContext {
  creatorId?: string;
  maxLevel?: number;
}

define<CategoryEntity, CategoryContext>(CategoryEntity, () => {
  const category = new CategoryEntity();

  category.name = faker.lorem.word(Math.floor(Math.random() * 5));

  return category;
});
