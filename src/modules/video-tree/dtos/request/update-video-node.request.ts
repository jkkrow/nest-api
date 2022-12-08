import { Allow, IsString, Min } from 'class-validator';

import { IsLessThanOrEqualTo } from 'src/common/decorators/validator.decorator';
import { IVideoNode } from '../../interfaces/video-node';

export class UpdateVideoNodeRequest implements IVideoNode {
  @Allow()
  id: string;

  @Allow()
  level: number;

  @Allow()
  children: IVideoNode[];

  @IsString()
  name: string;

  @IsString()
  url: string;

  @Min(0)
  duration: number;

  @Min(0)
  size: number;

  @IsString()
  label: string;

  @Min(0)
  @IsLessThanOrEqualTo('selectionTimeEnd')
  selectionTimeStart: number;

  @Min(0)
  @IsLessThanOrEqualTo('duration')
  selectionTimeEnd: number;
}
