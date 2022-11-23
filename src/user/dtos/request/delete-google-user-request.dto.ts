import { IsString } from 'class-validator';

export class DeleteGoogleUserRequestDto {
  @IsString()
  token: string;
}
