import {
  IsString,
  IsBoolean,
  IsIn,
  Min,
  ValidateNested,
  ArrayMaxSize,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

import { IsLessThanOrEqualTo } from 'src/common/decorators/validator.decorator';
import {
  VideoTreeStatus,
  VIDEO_TREE_STATUS,
} from '../../constants/video-tree.contstant';

export class UpdateVideoTreeRoot {
  @IsString()
  id: string;

  @IsString()
  @MaxLength(150)
  label: string;

  @Min(0)
  @IsLessThanOrEqualTo('selectionTimeEnd')
  selectionTimeStart: number;

  @Min(0)
  selectionTimeEnd: number;

  @ValidateNested({ each: true })
  @Type(() => UpdateVideoTreeRoot)
  children: UpdateVideoTreeRoot[];
}

export class UpdateVideoTreeRequest {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString({ each: true })
  @ArrayMaxSize(10)
  categories: string[];

  @IsString()
  @MaxLength(2000)
  description: string;

  @IsString()
  thumbnail: string;

  @IsIn(Object.values(VIDEO_TREE_STATUS))
  status: VideoTreeStatus;

  @IsBoolean()
  editing: boolean;

  @ValidateNested()
  @Type(() => UpdateVideoTreeRoot)
  root: UpdateVideoTreeRoot;
}
