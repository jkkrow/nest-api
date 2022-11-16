import { Controller, Post, Get, Patch, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger/dist';

import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CreateUserCommand } from './commands/impl/create-user.command';
// import { SigninQuery } from './queries/impl/signin.query';
import { SignupRequestDto } from './dtos/signup-request.dto';
import { UserDto } from './dtos/user.dto';

@Controller('users')
@ApiTags('Users')
@Serialize(UserDto)
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('signup')
  async signup(@Body() { name, email, password }: SignupRequestDto) {
    const command = new CreateUserCommand(name, email, password);
    await this.commandBus.execute(command);

    // const query = new SigninQuery(email, password);
    // const result = await this.queryBus.execute(query);

    // return result;
  }

  @Post('signin')
  siginin() {
    // Get Tokens Query
    // Get User Query
  }

  @Post('signin/google')
  googleSignin() {
    // Get Tokens Query
    // Get User Query
  }

  @Post('verification')
  sendVerification() {
    // Send Verification Command
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
