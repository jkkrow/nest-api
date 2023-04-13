import {
  IsString,
  IsNumber,
  IsBoolean,
  IsIn,
  ValidateNested,
  ArrayMaxSize,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

import {
  VideoTreeStatus,
  VIDEO_TREE_STATUS,
} from '../../constants/video-tree.contstant';

export class UpdateVideoTreeRoot {
  @IsString()
  id: string;

  @IsString()
  label: string;

  @IsNumber()
  selectionTimeStart: number;

  @IsNumber()
  selectionTimeEnd: number;

  @ValidateNested({ each: true })
  @Type(() => UpdateVideoTreeRoot)
  children: UpdateVideoTreeRoot[];
}

export class UpdateVideoTreeRequest {
  @IsString()
  @MaxLength(50)
  title: string;

  @IsString({ each: true })
  @ArrayMaxSize(10)
  categories: string[];

  @IsString()
  @MaxLength(1000)
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
