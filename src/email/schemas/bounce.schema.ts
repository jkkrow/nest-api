import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

import { DatabaseSchema } from 'src/database/schemas/database.schema';

@Schema({ collection: 'bounces' })
export class BounceSchema extends DatabaseSchema {
  @Prop({ required: true, unique: true })
  Email: string;

  @Prop({ required: true })
  From: string;

  @Prop({ required: true })
  Type: string;

  @Prop({ default: '' })
  Description: string;

  @Prop({ default: '' })
  Details: string;

  @Prop({ required: true })
  MessageStream: string;

  @Prop({ required: true })
  BouncedAt: Date;
}

export const BounceSchemaClass = SchemaFactory.createForClass(BounceSchema);
