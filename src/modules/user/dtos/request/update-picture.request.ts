import { IsString } from 'class-validator';

export class UpdatePictureRequest {
  @IsString()
  picture: string;
}
