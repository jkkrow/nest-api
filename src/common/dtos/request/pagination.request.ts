import { IsOptional, IsInt, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class OffsetPaginationRequest {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  max: number = 30;
}

export class KeysetPaginationRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  max: number = 30;
}
