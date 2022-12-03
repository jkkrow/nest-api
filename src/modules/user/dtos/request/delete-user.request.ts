import { IsEmail, IsString } from 'class-validator';

export class DeleteUserRequest {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
