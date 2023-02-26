import {
  IsOptional,
  IsInt,
  IsPositive,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class PaginationRequest {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  withCount?: boolean;

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  max: number = 30;
}
