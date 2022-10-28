import { IsString, IsDate } from 'class-validator';

export class CreateBounceDto {
  @IsString()
  readonly Email: string;

  @IsString()
  readonly From: string;

  @IsString()
  readonly Type: string;

  @IsString()
  readonly Description: string;

  @IsString()
  readonly Details: string;

  @IsString()
  readonly MessageStream: string;

  @IsDate()
  readonly BouncedAt: Date;
}
