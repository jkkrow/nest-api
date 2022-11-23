import { IsEmail, IsString } from 'class-validator';

export class DeleteUserRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
