import { IsEmail } from 'class-validator';

export class DeleteBounceRequest {
  @IsEmail()
  email: string;
}
