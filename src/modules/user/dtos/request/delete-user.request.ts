import { IsString } from 'class-validator';

export class DeleteUserRequest {
  @IsString()
  password: string;
}
