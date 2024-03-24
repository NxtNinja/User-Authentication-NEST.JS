import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginAuthAuthDto } from './dto/create-auth.dto';
import { Tokens } from './types/tokens.types';
import { RefreshTokenGuard } from './common/guards/refresh.guard';
import { getCurrentUser } from './common/decorators/getCurrentUser.decorator';
import { Public } from './common/decorators/public.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  signup(@Body() createAuthDto: CreateAuthDto): Promise<Tokens> {
    return this.authService.signup(createAuthDto);
  }

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginAuthDto: LoginAuthAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    const tokens = await this.authService.login(loginAuthDto);

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 5,
    });

    return tokens;
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@getCurrentUser('sub') userid: string) {
    return this.authService.logout(userid);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @getCurrentUser('sub') userid: string,
    @getCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refresh(userid, refreshToken);
  }
}
