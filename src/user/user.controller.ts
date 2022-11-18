import { Controller, Post, Get, Patch, Body, HttpCode } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger/dist';

import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { SendVerificationCommand } from './commands/impl/send-verification.command';
import { SigninQuery } from './queries/impl/signin.query';
import { SignupRequestDto } from './dtos/request/signup-request.dto';
import { SignupResponseDto } from './dtos/response/signup-response.dto';
import { SigninRequestDto } from './dtos/request/signin-request.dto';
import { SigninResponseDto } from './dtos/response/signin-response.dto';
import { SendVerificationRequestDto } from './dtos/request/send-verification-request.dto';
import { SendVerificationResponseDto } from './dtos/response/send-verification-response.dto';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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

  @Post('signin/google')
  googleSignin() {
    // Get Tokens Query
    // Get User Query
  }

  @Post('verification')
  @HttpCode(200)
  @Serialize(SendVerificationResponseDto)
  @ApiOperation({ description: 'Send Verification Email' })
  @ApiResponse({ type: SendVerificationResponseDto, status: 200 })
  async sendVerification(@Body() { email }: SendVerificationRequestDto) {
    const command = new SendVerificationCommand(email);
    await this.commandBus.execute(command);

    return {
      message: 'Verification email sent. Check your email and confirm signup',
    };
  }

  @Post('verification/:token')
  checkVerification() {
    // Check Verification Command
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
