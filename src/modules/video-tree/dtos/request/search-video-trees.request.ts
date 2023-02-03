import { IsString } from 'class-validator';

import { OffsetPaginationRequest } from 'src/common/dtos/request/pagination.request';

export class SearchVideoTreesRequest extends OffsetPaginationRequest {
  @IsString()
  keyword: string;
}
