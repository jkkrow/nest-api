import { IsString, IsOptional } from 'class-validator';

import { KeysetPaginationRequest } from 'src/common/dtos/request/pagination.request';

export class GetVideoTreesRequest extends KeysetPaginationRequest {
  @IsOptional()
  @IsString({ each: true })
  ids?: string[];
}
