import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { MessageResponse } from 'src/common/dtos/response/message.response';
import { IUser } from '../interfaces/user.interface';
import { Role } from '../decorators/role.decorator';
import { CurrentUser, CurrentUserId } from '../decorators/request.decorator';
import { CreateUserCommand } from '../commands/impl/create-user.command';
import { CreateGoogleUserCommand } from '../commands/impl/create-google-user.command';
import { SendVerificationCommand } from '../commands/impl/send-verification.command';
import { CheckVerificationCommand } from '../commands/impl/check-verification.comand';
import { SendRecoveryCommand } from '../commands/impl/send-recovery.command';
import { CheckRecoveryCommand } from '../commands/impl/check-recovery.command';
import { ResetPasswordCommand } from '../commands/impl/reset-password.command';
import { UpdateNameCommand } from '../commands/impl/update-name.command';
import { UpdatePasswordCommand } from '../commands/impl/update-password.command';
import { UpdatePictureCommand } from '../commands/impl/update-picture.command';
import { DeleteUserCommand } from '../commands/impl/delete-user.command';
import { DeleteGoogleUserCommand } from '../commands/impl/delete-google-user.command';
import { SigninQuery } from '../queries/impl/signin.query';
import { GoogleSigninQuery } from '../queries/impl/google-signin.query';
import { GetAuthTokenQuery } from '../queries/impl/get-auth-token.query';
import { SignupRequest } from '../dtos/request/signup.request';
import { SignupResponse } from '../dtos/response/signup.response';
import { SigninRequest } from '../dtos/request/signin.request';
import { SigninResponse } from '../dtos/response/signin.response';
import { GoogleSigninRequest } from '../dtos/request/google-signin.request';
import { GoogleSigninResponse } from '../dtos/response/google-signin.response';
import { SendVerificationRequest } from '../dtos/request/send-verification.request';
import { SendRecoveryRequest } from '../dtos/request/send-recovery.request';
import { ResetPasswordRequest } from '../dtos/request/reset-password.request';
import { GetAuthTokenRequest } from '../dtos/request/get-auth-token.request';
import { GetAuthTokenResponse } from '../dtos/response/get-auth-token.response';
import { GetUserResponse } from '../dtos/response/get-user.response';
import { GetMembershipResponse } from '../dtos/response/get-membership.response';
import { UpdateNameRequest } from '../dtos/request/update-name.request';
import { UpdatePasswordRequest } from '../dtos/request/update-password.request';
import { UpdatePictureRequest } from '../dtos/request/update-picture.request';
import { DeleteUserRequest } from '../dtos/request/delete-user.request';
import { DeleteGoogleUserRequest } from '../dtos/request/delete-google-user.request';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /* Signup User */
  /*--------------------------------------------*/
  @Post('signup')
  @Serialize(SignupResponse, { status: 201 })
  async signup(@Body() { name, email, password }: SignupRequest) {
    const command = new CreateUserCommand(name, email, password);
    await this.commandBus.execute(command);

    const query = new SigninQuery(email, password);
    const { user, refreshToken, accessToken } = await this.queryBus.execute(
      query,
    );

    return {
      user,
      refreshToken,
      accessToken,
      message: 'Verification email sent. Check your email and confirm signup',
    };
  }

  /* Signin User */
  /*--------------------------------------------*/
  @Post('signin')
  @HttpCode(200)
  @Serialize(SigninResponse)
  async signin(@Body() { email, password }: SigninRequest) {
    const query = new SigninQuery(email, password);
    const { user, refreshToken, accessToken } = await this.queryBus.execute(
      query,
    );

    return { user, refreshToken, accessToken };
  }

  /* Signin Google User */
  /*--------------------------------------------*/
  @Post('signin-google')
  @HttpCode(200)
  @Serialize(GoogleSigninResponse)
  async googleSignin(@Body() { token }: GoogleSigninRequest) {
    const command = new CreateGoogleUserCommand(token);
    await this.commandBus.execute(command);

    const query = new GoogleSigninQuery(token);
    const { user, refreshToken, accessToken } = await this.queryBus.execute(
      query,
    );

    return { user, refreshToken, accessToken };
  }

  /* Send Verification */
  /*--------------------------------------------*/
  @Post('verification')
  @HttpCode(200)
  @Serialize(MessageResponse)
  async sendVerification(@Body() { email }: SendVerificationRequest) {
    const command = new SendVerificationCommand(email);
    await this.commandBus.execute(command);

    return {
      message: 'Verification email sent. Check your email and confirm signup',
    };
  }

  /* Check Verification */
  /*--------------------------------------------*/
  @Post('verification/:token')
  @HttpCode(200)
  @Serialize(MessageResponse)
  async checkVerification(@Param('token') token: string) {
    const command = new CheckVerificationCommand(token);
    await this.commandBus.execute(command);

    return {
      message: 'Account verified successfully',
    };
  }

  /* Send Recovery */
  /*--------------------------------------------*/
  @Post('recovery')
  @HttpCode(200)
  @Serialize(MessageResponse)
  async sendRecovery(@Body() { email }: SendRecoveryRequest) {
    const command = new SendRecoveryCommand(email);
    await this.commandBus.execute(command);

    return {
      message: 'Recovery email sent. Check your email to reset password',
    };
  }

  /* Check Recovery */
  /*--------------------------------------------*/
  @Post('recovery/:token')
  @HttpCode(200)
  @Serialize(MessageResponse)
  async checkRecovery(@Param('token') token: string) {
    const command = new CheckRecoveryCommand(token);
    await this.commandBus.execute(command);

    return {
      message: 'Recovery token verified successfully',
    };
  }

  /* Reset Password */
  /*--------------------------------------------*/
  @Patch('recovery/:token/password')
  @Serialize(MessageResponse)
  async resetPassword(
    @Body() { password }: ResetPasswordRequest,
    @Param('token') token: string,
  ) {
    const command = new ResetPasswordCommand(token, password);
    await this.commandBus.execute(command);

    return {
      message: 'Password reset successfully',
    };
  }

  /* Get Auth Token */
  /*--------------------------------------------*/
  @Get('token')
  @Serialize(GetAuthTokenResponse)
  async getToken(@Body() { refreshToken: token }: GetAuthTokenRequest) {
    const query = new GetAuthTokenQuery(token);
    const { refreshToken, accessToken } = await this.queryBus.execute(query);

    return { refreshToken, accessToken };
  }

  /* Get User */
  /*--------------------------------------------*/
  @Get('current')
  @Role('user')
  @Serialize(GetUserResponse)
  async getUser(@CurrentUser() user: IUser) {
    return { user };
  }

  /* Get User Membership */
  /*--------------------------------------------*/
  @Get('current/membership')
  @Role('user')
  @Serialize(GetMembershipResponse)
  async getMembership(@CurrentUser() { membership }: IUser) {
    return { membership };
  }

  /* Update User Name */
  /*--------------------------------------------*/
  @Patch('current/name')
  @Role('user')
  @Serialize(MessageResponse)
  async updateName(
    @Body() { name }: UpdateNameRequest,
    @CurrentUserId() id: string,
  ) {
    const command = new UpdateNameCommand(id, name);
    await this.commandBus.execute(command);

    return {
      message: 'User name updated successfully',
    };
  }

  /* Update User Password */
  /*--------------------------------------------*/
  @Patch('current/password')
  @Role('user')
  @Serialize(MessageResponse)
  async updatePassword(
    @Body() { password, newPassword }: UpdatePasswordRequest,
    @CurrentUserId() id: string,
  ) {
    const command = new UpdatePasswordCommand(id, password, newPassword);
    await this.commandBus.execute(command);

    return {
      message: 'User password updated successfully',
    };
  }

  /* Update User Picture */
  /*--------------------------------------------*/
  @Patch('current/picture')
  @Role('user')
  @Serialize(MessageResponse)
  async updatePicture(
    @Body() { picture }: UpdatePictureRequest,
    @CurrentUserId() id: string,
  ) {
    const command = new UpdatePictureCommand(id, picture);
    await this.commandBus.execute(command);

    return {
      message: 'User picture updated successfully',
    };
  }

  /* Delete User */
  /*--------------------------------------------*/
  @Post('current/deletion')
  @Role('user')
  @HttpCode(200)
  @Serialize(MessageResponse)
  async deleteUser(
    @Body() { email, password }: DeleteUserRequest,
    @CurrentUserId() id: string,
  ) {
    const command = new DeleteUserCommand(id, email, password);
    await this.commandBus.execute(command);

    return {
      message: 'User deleted successfully',
    };
  }

  /* Delete Google User */
  /*--------------------------------------------*/
  @Post('current/deletion-google')
  @Role('user')
  @HttpCode(200)
  @Serialize(MessageResponse)
  async deleteGoogleUser(
    @Body() { token }: DeleteGoogleUserRequest,
    @CurrentUserId() id: string,
  ) {
    const command = new DeleteGoogleUserCommand(id, token);
    await this.commandBus.execute(command);

    return {
      message: 'User deleted successfully',
    };
  }
}
