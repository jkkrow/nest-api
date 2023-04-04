import { IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CompleteMultipartUploadRequest {
  @IsString()
  videoId: string;

  @IsString()
  fileName: string;

  @ValidateNested({ each: true })
  @Type(() => Parts)
  parts: Parts[];
}

class Parts {
  @IsString()
  ETag: string;

  @IsNumber()
  PartNumber: number;
}
