import { IsString } from 'class-validator';

export class UpdatePictureRequestDto {
  @IsString()
  picture: string;
}
