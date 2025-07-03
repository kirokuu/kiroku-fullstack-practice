import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthController } from './auth/auth.controller';
@Module({
  imports: [],
  controllers: [AppController, AuthController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
