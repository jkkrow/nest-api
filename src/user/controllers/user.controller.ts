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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger/dist';

import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { MessageResponseDto } from 'src/common/dtos/message-response.dto';
import { CreateUserCommand } from '../commands/impl/create-user.command';
import { CreateGoogleUserCommand } from '../commands/impl/create-google-user.command';
import { SendVerificationCommand } from '../commands/impl/send-verification.command';
import { CheckVerificationCommand } from '../commands/impl/check-verification.comand';
import { SigninQuery } from '../queries/impl/signin.query';
import { GoogleSigninQuery } from '../queries/impl/google-signin.query';
import { SignupRequestDto } from '../dtos/request/signup-request.dto';
import { SignupResponseDto } from '../dtos/response/signup-response.dto';
import { SigninRequestDto } from '../dtos/request/signin-request.dto';
import { SigninResponseDto } from '../dtos/response/signin-response.dto';
import { GoogleSigninRequestDto } from '../dtos/request/google-signin-request.dto';
import { GoogleSigninResponseDto } from '../dtos/response/google-signin-response.dto';
import { SendVerificationRequestDto } from '../dtos/request/send-verification-request.dto';

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
  @ApiOperation({ description: 'Signup User' })
  @ApiResponse({ type: SignupResponseDto, status: 201 })
  async signup(@Body() { name, email, password }: SignupRequestDto) {
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
  @Serialize(SigninResponseDto)
  @ApiOperation({ description: 'Signin User' })
  @ApiResponse({ type: SigninResponseDto, status: 200 })
  async siginin(@Body() { email, password }: SigninRequestDto) {
    const query = new SigninQuery(email, password);
    const result = await this.queryBus.execute(query);

    return result;
  }

  /* Signin Google User */
  /*--------------------------------------------*/
  @Post('signin/google')
  @HttpCode(200)
  @Serialize(GoogleSigninResponseDto)
  @ApiOperation({ description: 'Signin Google User' })
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
  @ApiOperation({ description: 'Send Verification' })
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
  @ApiOperation({ description: 'Check Verification' })
  @ApiResponse({ type: MessageResponseDto, status: 200 })
  async checkVerification(@Param('token') token: string) {
    const command = new CheckVerificationCommand(token);
    await this.commandBus.execute(command);

    return {
      message: 'Your account has been successfully verified',
    };
  }

  @Post('recovery')
  sendRecovery() {
    // Send Recovery Command
  }

  @Post('recovery/:token')
  checkRecovery() {
    // Check Recovery Command
  }

  @Patch('recovery/:token/password')
  resetPassword() {
    // Update Password Command
  }

  @Get('refresh-token')
  getRefreshToken() {
    // Get Tokens Query
  }

  @Get('access-token')
  getAccessToken() {
    // Get Token Query
  }
}
