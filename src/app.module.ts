import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './auth/common/guards/access.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
