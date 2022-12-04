import { IsString, IsNumber, ValidateNested } from 'class-validator';

export class CompleteMultipartUploadRequest {
  @IsString()
  videoId: string;

  @IsString()
  fileName: string;

  @ValidateNested()
  parts: Parts[];
}

class Parts {
  @IsString()
  ETag: string;

  @IsNumber()
  PartNumber: number;
}
