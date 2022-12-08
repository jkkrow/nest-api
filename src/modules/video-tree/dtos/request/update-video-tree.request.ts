import {
  Allow,
  IsString,
  IsNumber,
  IsBoolean,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import {
  VideoTreeStatus,
  VIDEO_TREE_STATUS,
} from '../../constants/video-tree.contstant';
import { IVideoTree } from '../../interfaces/video-tree';

class UpdateVideoTreeRoot {
  @Allow()
  id: string;

  @Allow()
  level: number;

  @Allow()
  name: string;

  @Allow()
  url: string;

  @Allow()
  size: number;

  @Allow()
  duration: number;

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

export class UpdateVideoTreeRequest implements IVideoTree {
  @Allow()
  id: string;

  @Allow()
  userId: string;

  @Allow()
  size: number;

  @Allow()
  maxDuration: number;

  @Allow()
  minDuration: number;

  @IsString()
  title: string;

  @IsString({ each: true })
  categories: string[];

  @IsString()
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
