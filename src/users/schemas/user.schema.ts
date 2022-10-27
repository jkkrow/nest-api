import { Schema, Prop } from '@nestjs/mongoose';

import { DatabaseSchema } from 'src/database/database.schema';
import { IUserPremium } from '../interfaces/user.interface';

@Schema({ collection: 'users' })
export class UserSchema extends DatabaseSchema {
  @Prop({ required: true, enum: ['native', 'google'] })
  type: string;

  @Prop({ required: true })
  name: string;

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

  @Prop({
    type: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      expiredAt: { type: Date, required: true },
      isCancelled: { type: Boolean, required: true, default: false },
    },
    default: null,
    _id: false,
  })
  premium: IUserPremium | null;

  @Prop({ type: [{ type: String, ref: 'User' }] })
  subscribers: string[];
}
