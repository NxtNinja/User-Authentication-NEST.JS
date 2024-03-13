import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginAuthAuthDto } from './dto/create-auth.dto';
import { Tokens } from './types/tokens.types';
import { RefreshTokenGuard } from './common/guards/refresh.guard';
import { getCurrentUser } from './common/decorators/getCurrentUser.decorator';
import { Public } from './common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() createAuthDto: CreateAuthDto): Promise<Tokens> {
    return this.authService.signup(createAuthDto);
  }

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginAuthDto: LoginAuthAuthDto): Promise<Tokens> {
    return this.authService.login(loginAuthDto);
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
