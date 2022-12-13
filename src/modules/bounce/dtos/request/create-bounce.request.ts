import { IsString, IsEmail, IsDateString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateBounceRequest {
  @IsEmail()
  @Expose({ name: 'Email' })
  email: string;

  @IsString()
  @Expose({ name: 'From' })
  sender: string;

  @IsString()
  @Expose({ name: 'Type' })
  type: string;

  @IsString()
  @Expose({ name: 'Description' })
  description: string;

  @IsString()
  @Expose({ name: 'Details' })
  details: string;

  @IsString()
  @Expose({ name: 'MessageStream' })
  messageStream: string;

  @IsDateString()
  @Expose({ name: 'BouncedAt' })
  bouncedAt: string;
}
