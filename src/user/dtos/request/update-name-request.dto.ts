import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateNameRequestDto {
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  name: string;
}
