import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

import { DatabaseSchema } from 'src/database/schemas/database.schema';
import { IUserPremium } from '../interfaces/user.interface';

const userPreimum = {
  id: { type: String, required: true },
  name: {
    type: String,
    required: true,
    enum: ['Standard', 'Business', 'Enterprise'],
  },
  expiredAt: { type: Date, required: true },
  cancelled: { type: Boolean, required: true, default: false },
};

@Schema({ collection: 'users' })
export class UserSchema extends DatabaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['native', 'google'] })
  type: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  picture: string;

  @Prop({ required: true, default: false })
  verified: boolean;

  @Prop({ required: true, default: false })
  admin: boolean;

  @Prop({ type: userPreimum, default: null, _id: false })
  premium: IUserPremium | null;

  @Prop({ type: [{ type: String, ref: 'User' }] })
  subscribers: string[];
}

export const UserSchemaClass = SchemaFactory.createForClass(UserSchema);
