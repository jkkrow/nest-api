import { IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

import { IsLessThanOrEqualTo } from 'src/common/decorators/validator.decorator';
import { UpdateVideoNodeProps } from '../../interfaces/video-node';

export class UpdateVideoNodeRequest implements UpdateVideoNodeProps {
  @IsString()
  @Transform(({ value }) => encodeURIComponent(value))
  name: string;

  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

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
