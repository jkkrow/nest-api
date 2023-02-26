import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

import { PaginationRequest } from 'src/common/dtos/request/pagination.request';

export class GetHistoriesRequest extends PaginationRequest {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  skipEnded: boolean = false;
}
