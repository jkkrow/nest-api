import { Prop, Schema } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true, versionKey: false })
export abstract class DatabaseSchema {
  @Prop({ type: String, default: uuidv4 })
  readonly _id: string;
}
