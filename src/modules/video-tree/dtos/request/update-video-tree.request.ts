import {
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
import { UpdateVideoTreeProps } from '../../interfaces/video-tree';

class UpdateVideoTreeRoot {
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

export class UpdateVideoTreeRequest implements UpdateVideoTreeProps {
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
