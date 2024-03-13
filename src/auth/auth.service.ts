import * as bcrypt from 'bcrypt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAuthDto, LoginAuthAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  comparePasswords,
  // compareRefreshTokens,
  hashPassword,
} from 'src/utils/bcrypt';
import { Tokens } from './types/tokens.types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  //funtion for signing access and refresh tokens. This function returns a Promise of type Tokens that retuns access and refresh tokens
  async getTokens(userid: string, email: string): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      //for access token
      this.jwtService.signAsync(
        {
          sub: userid,
          email,
        },
        {
          secret: 'access_secret@1234',
          expiresIn: 60 * 5,
        },
      ),
      //for refresh token
      this.jwtService.signAsync(
        {
          sub: userid,
          email,
        },
        {
          secret: 'refresh_secret@1234',
          expiresIn: 3600 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  //take password from the req -> hash it -> store other data in db -> store hashed password in db
  async signup(createAuthDto: CreateAuthDto): Promise<Tokens> {
    const hash = await hashPassword(createAuthDto.hash); // hash password
    //create user
    const newuser = await this.prisma.user.create({
      data: {
        ...createAuthDto,
        hash,
      },
    });

    //generate tokens
    const tokens = await this.getTokens(newuser.id, newuser.email);

    //store the refresh_token in db after hashing it
    await this.updateHash(newuser.id, tokens.refresh_token);

    //return tokens as the function returns a Promise of type Tokens
    return tokens;
  }

  //Take the refresh token -> hash it -> store in db
  async updateHash(userid: string, refresh_token: string) {
    const hash = await hashPassword(refresh_token); // hash the refresh token
    //update the current user's hashedRt field
    await this.prisma.user.update({
      where: {
        id: userid,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async login(loginAuthDto: LoginAuthAuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginAuthDto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('User does not exists');
    }

    const matchPasswords = await comparePasswords(loginAuthDto.hash, user.hash);

    if (!matchPasswords) {
      throw new ForbiddenException('Invalid user credentials');
    }

    //generate tokens
    const tokens = await this.getTokens(user.id, user.email);

    //store the refresh_token in db after hashing it
    await this.updateHash(user.id, tokens.refresh_token);

    //return tokens as the function returns a Promise of type Tokens
    return tokens;
  }

  async logout(userid: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userid,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
    return { message: 'User Logged out successfully' };
  }
  async refresh(userid: string, refresh_token: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userid,
      },
    });

    if (!user) {
      throw new ForbiddenException('User does not exists');
    }

    const refreshMatches = await bcrypt.compare(refresh_token, user.hashedRt);

    if (!refreshMatches) {
      throw new ForbiddenException('Refresh Tokens does not match');
    }

    //generate tokens
    const tokens = await this.getTokens(user.id, user.email);

    //store the refresh_token in db after hashing it
    await this.updateHash(user.id, tokens.refresh_token);

    //return tokens as the function returns a Promise of type Tokens
    return tokens;
  }
}
