import { IsString, IsOptional } from 'class-validator';

import { PaginationRequest } from 'src/common/dtos/request/pagination.request';

export class GetVideoTreesRequest extends PaginationRequest {
  @IsOptional()
  @IsString({ each: true })
  ids?: string[];
}
