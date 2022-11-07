// import { NotFoundException } from '@nestjs/common';
// import { AggregateRoot } from '@nestjs/cqrs';

// import { DatabaseEntityFactory } from '../entities/database-entity.factory';
// import { DatabaseEntity } from '../entities/database.entity';

// export abstract class DatabaseRepository<
//   TSchema extends DatabaseEntity,
//   TEntity extends AggregateRoot,
// > {
//   constructor(
//     protected readonly entityModel: Model<TSchema>,
//     protected readonly schemaFactory: DatabaseEntityFactory<TSchema, TEntity>,
//   ) {}

//   protected async findOne(
//     entityFilterQuery?: FilterQuery<TSchema>,
//     notFoundError?: boolean,
//   ): Promise<TEntity> {
//     const entityDocument = await this.entityModel.findOne(
//       entityFilterQuery,
//       {},
//       { lean: true },
//     );

//     if (!entityDocument && notFoundError) {
//       throw new NotFoundException('Entity not found.');
//     }

//     return this.schemaFactory.createFromSchema(entityDocument);
//   }

//   protected async find(
//     entityFilterQuery?: FilterQuery<TSchema>,
//   ): Promise<TEntity[]> {
//     const entityDocuments = await this.entityModel.find(
//       entityFilterQuery,
//       {},
//       { lean: true },
//     );

//     return entityDocuments.map((entityDocument) =>
//       this.schemaFactory.createFromSchema(entityDocument),
//     );
//   }

//   protected async create(entity: TEntity): Promise<void> {
//     await new this.entityModel(this.schemaFactory.create(entity)).save();
//   }

//   protected async findOneAndReplace(
//     entityFilterQuery: FilterQuery<TSchema>,
//     entity: TEntity,
//   ): Promise<void> {
//     const updatedEntityDocument = await this.entityModel.findOneAndReplace(
//       entityFilterQuery,
//       this.schemaFactory.create(entity),
//       {
//         new: true,
//         useFindAndModify: false,
//         lean: true,
//       },
//     );

//     if (!updatedEntityDocument) {
//       throw new NotFoundException('Unable to find the entity to replace.');
//     }
//   }
// }
