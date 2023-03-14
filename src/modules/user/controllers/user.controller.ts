import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';

import { Serialize } from 'src/common/decorators/serialize.decorator';
import { Cookie } from 'src/common/decorators/cookie.decorator';
import { Authenticate } from 'src/auth/decorators/auth.decorator';
import { MessageResponse } from 'src/common/dtos/response/message.response';
import { Role } from 'src/auth/decorators/role.decorator';
import { CurrentUser, CurrentUserId } from 'src/auth/decorators/user.decorator';
import { RequestUser } from 'src/auth/interfaces/user.interface';
import { PaymentGuard } from 'src/modules/payment/guards/payment.guard';

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
import { CreateMembershipCommand } from '../commands/impl/create-membership.command';
import { CancelMembershipCommand } from '../commands/impl/cancel-membership.command';
import { UpdateMembershipCommand } from '../commands/impl/update-membership.command';
import { DeleteUserCommand } from '../commands/impl/delete-user.command';
import { DeleteGoogleUserCommand } from '../commands/impl/delete-google-user.command';
import { SigninQuery } from '../queries/impl/signin.query';
import { SignoutQuery } from '../queries/impl/signout.query';
import { GoogleSigninQuery } from '../queries/impl/google-signin.query';
import { GetCredentialsQuery } from '../queries/impl/get-credentials.query';

import { SignupRequest } from '../dtos/request/signup.request';
import { SignupResponse } from '../dtos/response/signup.response';
import { SigninRequest } from '../dtos/request/signin.request';
import { SigninResponse } from '../dtos/response/signin.response';
import { SignoutResponse } from '../dtos/response/signout.response';
import { GoogleSigninRequest } from '../dtos/request/google-signin.request';
import { GoogleSigninResponse } from '../dtos/response/google-signin.response';
import { SendVerificationRequest } from '../dtos/request/send-verification.request';
import { SendRecoveryRequest } from '../dtos/request/send-recovery.request';
import { ResetPasswordRequest } from '../dtos/request/reset-password.request';
import { GetCredentialsResponse } from '../dtos/response/get-credentials.response';
import { GetUserResponse } from '../dtos/response/get-user.response';
import { UpdateNameRequest } from '../dtos/request/update-name.request';
import { UpdatePasswordRequest } from '../dtos/request/update-password.request';
import { UpdatePictureRequest } from '../dtos/request/update-picture.request';
import { CreateMembershipRequest } from '../dtos/request/create-membership.request';
import { CancelMembershipRequest } from '../dtos/request/cancel-membership.request';
import { UpdateMembershipRequest } from '../dtos/request/update-membership.request';
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
  @Authenticate()
  @Serialize(SignupResponse, { status: 201 })
  async signup(@Body() { name, email, password }: SignupRequest) {
    const command = new CreateUserCommand(name, email, password);
    await this.commandBus.execute(command);

    const query = new SigninQuery(email, password);
    const userWithCredentials = await this.queryBus.execute(query);

    const message = 'Verification email sent. Check email to finish signup';

    return { ...userWithCredentials, message };
  }

  /* Signin User */
  /*--------------------------------------------*/
  @Post('signin')
  @Authenticate()
  @Serialize(SigninResponse)
  async signin(@Body() { email, password }: SigninRequest) {
    const query = new SigninQuery(email, password);
    const userWithCredentials = await this.queryBus.execute(query);

    return userWithCredentials;
  }

  /* Signin Google User */
  /*--------------------------------------------*/
  @Post('signin-google')
  @Authenticate()
  @Serialize(GoogleSigninResponse)
  async googleSignin(@Body() { token }: GoogleSigninRequest) {
    const command = new CreateGoogleUserCommand(token);
    await this.commandBus.execute(command);

    const query = new GoogleSigninQuery(token);
    const userWithCredentials = await this.queryBus.execute(query);

    return userWithCredentials;
  }

  /* Signout User */
  /*--------------------------------------------*/
  @Post('signout')
  @Authenticate({ expire: true })
  @Serialize(SignoutResponse)
  async signout(@Cookie('refreshToken') refreshToken: string) {
    const query = new SignoutQuery(refreshToken);
    await this.queryBus.execute(query);

    return { refreshToken };
  }

  /* Send Verification */
  /*--------------------------------------------*/
  @Post('verification')
  @Serialize(MessageResponse)
  async sendVerification(@Body() { email }: SendVerificationRequest) {
    const command = new SendVerificationCommand(email);
    await this.commandBus.execute(command);

    const message = 'Verification email sent. Check email to finish signup';

    return { message };
  }

  /* Check Verification */
  /*--------------------------------------------*/
  @Post('verification/:token')
  @Serialize(MessageResponse)
  async checkVerification(@Param('token') token: string) {
    const command = new CheckVerificationCommand(token);
    await this.commandBus.execute(command);

    const message = 'Account verified successfully';

    return { message };
  }

  /* Send Recovery */
  /*--------------------------------------------*/
  @Post('recovery')
  @Serialize(MessageResponse)
  async sendRecovery(@Body() { email }: SendRecoveryRequest) {
    const command = new SendRecoveryCommand(email);
    await this.commandBus.execute(command);

    const message = 'Recovery email sent. Check your email to reset password';

    return { message };
  }

  /* Check Recovery */
  /*--------------------------------------------*/
  @Post('recovery/:token')
  @Serialize(MessageResponse)
  async checkRecovery(@Param('token') token: string) {
    const command = new CheckRecoveryCommand(token);
    await this.commandBus.execute(command);

    const message = 'Recovery token verified successfully';

    return { message };
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

    const message = 'Password reset successfully';

    return { message };
  }

  /* Get User */
  /*--------------------------------------------*/
  @Get('current')
  @Role('user')
  @Serialize(GetUserResponse)
  async getUser(@CurrentUser() user: RequestUser) {
    return { user };
  }

  /* Get User Credentials */
  /*--------------------------------------------*/
  @Get('current/credentials')
  @ApiCookieAuth()
  @Authenticate()
  @Serialize(GetCredentialsResponse)
  async getCredentials(@Cookie('refreshToken') refreshToken: string) {
    const query = new GetCredentialsQuery(refreshToken);
    const credentials = await this.queryBus.execute(query);

    return credentials;
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

    const message = 'User name updated successfully';

    return { message };
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

    const message = 'Password updated successfully';

    return { message };
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

    const message = 'Profile picture updated successfully';

    return { message };
  }

  /* Create User Membership */
  /*--------------------------------------------*/
  @Post('current/membership')
  @Role('verified')
  @Serialize(MessageResponse)
  async createMembership(
    @Body() { subscriptionId }: CreateMembershipRequest,
    @CurrentUserId() id: string,
  ) {
    const command = new CreateMembershipCommand(id, subscriptionId);
    await this.commandBus.execute(command);

    const message = 'Membership registered successfully';

    return { message };
  }

  /* Cancel User Membership */
  /*--------------------------------------------*/
  @Post('current/membership/cancel')
  @Role('verified')
  @Serialize(MessageResponse)
  async cancelMembership(
    @Body() { reason }: CancelMembershipRequest,
    @CurrentUserId() id: string,
  ) {
    const command = new CancelMembershipCommand(id, reason);
    await this.commandBus.execute(command);

    const message = 'Membership cancelled successfully';

    return { message };
  }

  /* Update User Membership */
  /*--------------------------------------------*/
  @Patch('current/membership')
  @UseGuards(PaymentGuard)
  @Serialize(MessageResponse)
  async updateMembership(
    @Body() { eventType, subscriptionId, userId }: UpdateMembershipRequest,
  ) {
    if (eventType === 'PAYMENT.SALE.COMPLETED') {
      const command = new UpdateMembershipCommand(subscriptionId);
      await this.commandBus.execute(command);
    }

    if (eventType === 'BILLING.SUBSCRIPTION.CANCELLED') {
      const command = new CancelMembershipCommand(userId);
      await this.commandBus.execute(command);
    }

    const message = 'Membership updated successfully';

    return { message };
  }

  /* Delete User */
  /*--------------------------------------------*/
  @Post('current/deletion')
  @Role('user')
  @Serialize(MessageResponse)
  async deleteUser(
    @Body() { password }: DeleteUserRequest,
    @CurrentUserId() id: string,
  ) {
    const command = new DeleteUserCommand(id, password);
    await this.commandBus.execute(command);

    const message = 'User deleted successfully';

    return { message };
  }

  /* Delete Google User */
  /*--------------------------------------------*/
  @Post('current/deletion-google')
  @Role('user')
  @Serialize(MessageResponse)
  async deleteGoogleUser(
    @Body() { token }: DeleteGoogleUserRequest,
    @CurrentUserId() id: string,
  ) {
    const command = new DeleteGoogleUserCommand(id, token);
    await this.commandBus.execute(command);

    const message = 'User deleted successfully';

    return { message };
  }
}
