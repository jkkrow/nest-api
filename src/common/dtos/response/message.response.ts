import { Expose } from 'class-transformer';

export class MessageResponse {
  @Expose()
  message: string;
}
