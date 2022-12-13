import { IsString, Min, IsBoolean } from 'class-validator';

import { IsGreaterThanOrEqualTo } from 'src/common/decorators/validator.decorator';

export class SaveHistoryRequest {
  @IsString()
  activeNodeId: string;

  @Min(0)
  progress: number;

  @Min(0)
  @IsGreaterThanOrEqualTo('progress')
  totalProgress: number;

  @IsBoolean()
  ended: boolean;
}
