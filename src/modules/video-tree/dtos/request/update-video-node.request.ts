import { IsOptional, IsString, Min, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

import { IsLessThanOrEqualTo } from 'src/common/decorators/validator.decorator';
import { UpdateVideoNodeProps } from '../../interfaces/video-node';

export class UpdateVideoNodeRequest implements UpdateVideoNodeProps {
  @IsString()
  @Transform(({ value }) => encodeURIComponent(value))
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(150)
  label: string;

  @IsString()
  @MaxLength(300)
  url: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  thumbnail?: string;

  @Min(0)
  duration: number;

  @Min(0)
  size: number;

  @Min(0)
  @IsLessThanOrEqualTo('selectionTimeEnd')
  selectionTimeStart: number;

  @Min(0)
  @IsLessThanOrEqualTo('duration')
  selectionTimeEnd: number;
}
