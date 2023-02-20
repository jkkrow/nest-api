import { Transform } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

import { KeysetPaginationRequest } from 'src/common/dtos/request/pagination.request';

export class GetVideoTreesRequest extends KeysetPaginationRequest {
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (value instanceof Array) return value;
    return value ? value.split(',') : [];
  })
  ids?: string[];
}
