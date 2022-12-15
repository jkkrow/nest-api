import { IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

import { PaginationRequest } from 'src/common/dtos/request/pagination.request';

export class GetHistoriesRequest extends PaginationRequest {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  skipEnded?: boolean;
}
