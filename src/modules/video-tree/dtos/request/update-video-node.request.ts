import { IsString, Min } from 'class-validator';

import { IsLessThanOrEqualTo } from 'src/common/decorators/validator.decorator';
import { UpdateVideoNodeParams } from '../../interfaces/video-node';

export class UpdateVideoNodeRequest implements UpdateVideoNodeParams {
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
