import { IsString } from 'class-validator';

import { PaginationRequest } from 'src/common/dtos/request/pagination.request';

export class SearchVideoTreesRequest extends PaginationRequest {
  @IsString()
  keyword: string;
}
