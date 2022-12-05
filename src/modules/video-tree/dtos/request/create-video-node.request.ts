import { IsString } from 'class-validator';

export class CreateVideoNodeRequest {
  @IsString()
  parentId: string;
}
