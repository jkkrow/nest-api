import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateNameRequest {
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  name: string;
}
