import {
  Controller,
  Post,
  HttpCode,
  Body,
  Get,
  Patch,
  Headers,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateUserCommand } from './commands/impl/create-user.command';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('signup')
  signup(@Headers('authorization') auth: string) {
    // Create User Command
    console.log(auth);
    // Get Tokens Query
    // Get User Query
  }

  @HttpCode(200)
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
