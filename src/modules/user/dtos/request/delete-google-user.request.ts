import { IsString } from 'class-validator';

export class DeleteGoogleUserRequest {
  @IsString()
  token: string;
}
