import { IsString } from 'class-validator';

export class DeleteImageRequest {
  @IsString()
  key: string;
}
