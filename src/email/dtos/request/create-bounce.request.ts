import { IsString, IsDate } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateBounceRequest {
  @IsString()
  @Expose({ name: 'Email' })
  readonly email: string;

  @IsString()
  @Expose({ name: 'From' })
  readonly sender: string;

  @IsString()
  @Expose({ name: 'Type' })
  readonly type: string;

  @IsString()
  @Expose({ name: 'Description' })
  readonly description: string;

  @IsString()
  @Expose({ name: 'Details' })
  readonly details: string;

  @IsString()
  @Expose({ name: 'MessageStream' })
  readonly messageStream: string;

  @IsDate()
  @Expose({ name: 'BouncedAt' })
  readonly bouncedAt: Date;
}
