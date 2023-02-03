import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

import { KeysetPaginationRequest } from 'src/common/dtos/request/pagination.request';

export class GetHistoriesRequest extends KeysetPaginationRequest {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  skipEnded: boolean = false;
}
