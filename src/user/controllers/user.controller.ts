import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Headers,
  Param,
  HttpCode,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { MessageResponseDto } from 'src/common/dtos/message-response.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
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
import { SigninQuery } from '../queries/impl/signin.query';
import { GoogleSigninQuery } from '../queries/impl/google-signin.query';
import { GetAuthTokenQuery } from '../queries/impl/get-auth-token.query';
import { UserDto } from '../dtos/user.dto';
import { SignupRequestDto } from '../dtos/request/signup-request.dto';
import { SignupResponseDto } from '../dtos/response/signup-response.dto';
import { SigninRequestDto } from '../dtos/request/signin-request.dto';
import { SigninResponseDto } from '../dtos/response/signin-response.dto';
import { GoogleSigninRequestDto } from '../dtos/request/google-signin-request.dto';
import { GoogleSigninResponseDto } from '../dtos/response/google-signin-response.dto';
import { SendVerificationRequestDto } from '../dtos/request/send-verification-request.dto';
import { SendRecoveryRequestDto } from '../dtos/request/send-recovery-request.dto';
import { ResetPasswordRequestDto } from '../dtos/request/reset-password-request.dto';
import { GetAuthTokenResponseDto } from '../dtos/response/get-auth-token-response.dto';
import { GetUserResponseDto } from '../dtos/response/get-user-response.dto';
import { GetMembershipResponseDto } from '../dtos/response/get-membership-response.dto';
import { UpdateNameRequestDto } from '../dtos/request/update-name-request.dto';
import { UpdatePasswordRequestDto } from '../dtos/request/update-password-request.dto';
import { UpdatePictureRequestDto } from '../dtos/request/update-picture-request.dto';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /* Signup User */
  /*--------------------------------------------*/
  @Post('signup')
  @Serialize(SignupResponseDto)
  @ApiResponse({ type: SignupResponseDto, status: 201 })
  async signup(@Body() { name, email, password }: SignupRequestDto) {
    const command = new CreateUserCommand(name, email, password);
    await this.commandBus.execute(command);

    const query = new SigninQuery(email, password);
    const result = await this.queryBus.execute(query);

    return {
      ...result,
      message: 'Verification email sent. Check your email and confirm signup',
    };
  }

  /* Signin User */
  /*--------------------------------------------*/
  @Post('signin')
  @HttpCode(200)
  @Serialize(SigninResponseDto)
  @ApiResponse({ type: SigninResponseDto, status: 200 })
  async signin(@Body() { email, password }: SigninRequestDto) {
    const query = new SigninQuery(email, password);
    const result = await this.queryBus.execute(query);

    return result;
  }

  /* Signin Google User */
  /*--------------------------------------------*/
  @Post('signin/google')
  @HttpCode(200)
  @Serialize(GoogleSigninResponseDto)
  @ApiResponse({ type: SigninResponseDto, status: 200 })
  async googleSignin(@Body() { token }: GoogleSigninRequestDto) {
    const command = new CreateGoogleUserCommand(token);
    await this.commandBus.execute(command);

    const query = new GoogleSigninQuery(token);
    const result = await this.queryBus.execute(query);

    return result;
  }

  /* Send Verification */
  /*--------------------------------------------*/
  @Post('verification')
  @HttpCode(200)
  @Serialize(MessageResponseDto)
  @ApiResponse({ type: MessageResponseDto, status: 200 })
  async sendVerification(@Body() { email }: SendVerificationRequestDto) {
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
  @Serialize(MessageResponseDto)
  @ApiResponse({ type: MessageResponseDto, status: 200 })
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
  @Serialize(MessageResponseDto)
  @ApiResponse({ type: MessageResponseDto, status: 200 })
  async sendRecovery(@Body() { email }: SendRecoveryRequestDto) {
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
  @Serialize(MessageResponseDto)
  @ApiResponse({ type: MessageResponseDto, status: 200 })
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
  @Serialize(MessageResponseDto)
  @ApiResponse({ type: MessageResponseDto, status: 200 })
  async resetPassword(
    @Body() { password }: ResetPasswordRequestDto,
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
  @Serialize(GetAuthTokenResponseDto)
  @ApiResponse({ type: GetAuthTokenResponseDto, status: 200 })
  @ApiBearerAuth()
  async getToken(@Headers('authorization') authorization: string) {
    const refreshToken = authorization ? authorization.split('Bearer ')[1] : '';
    const query = new GetAuthTokenQuery(refreshToken);
    const result = await this.queryBus.execute(query);

    return result;
  }

  /* Get User */
  /*--------------------------------------------*/
  @Get('current')
  @Serialize(GetUserResponseDto)
  @ApiResponse({ type: GetUserResponseDto, status: 200 })
  @ApiBearerAuth()
  async getUser(@CurrentUser() user: UserDto) {
    return { user };
  }

  /* Get User Membership */
  /*--------------------------------------------*/
  @Get('current/membership')
  @Serialize(GetMembershipResponseDto)
  @ApiResponse({ type: GetMembershipResponseDto, status: 200 })
  @ApiBearerAuth()
  async getMembership(@CurrentUser() { membership }: UserDto) {
    return { membership };
  }

  /* Update User Name */
  /*--------------------------------------------*/
  @Patch('current/name')
  @Serialize(MessageResponseDto)
  @ApiResponse({ type: MessageResponseDto, status: 200 })
  @ApiBearerAuth()
  async updateName(
    @Body() { name }: UpdateNameRequestDto,
    @CurrentUser() { id }: UserDto,
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
  @Serialize(MessageResponseDto)
  @ApiResponse({ type: MessageResponseDto, status: 200 })
  @ApiBearerAuth()
  async updatePassword(
    @Body() { password, newPassword }: UpdatePasswordRequestDto,
    @CurrentUser() { id }: UserDto,
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
  @Serialize(MessageResponseDto)
  @ApiResponse({ type: MessageResponseDto, status: 200 })
  @ApiBearerAuth()
  async updatePicture(
    @Body() { picture }: UpdatePictureRequestDto,
    @CurrentUser() { id }: UserDto,
  ) {
    const command = new UpdatePictureCommand(id, picture);
    await this.commandBus.execute(command);

    return {
      message: 'User picture updated successfully',
    };
  }
}
