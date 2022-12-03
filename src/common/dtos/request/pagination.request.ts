import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationRequest {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  max?: number;
}
