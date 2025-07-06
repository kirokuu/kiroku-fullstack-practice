import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/auth')
export class AuthController {
  private csrfTokens: Map<string, { token: string; createdAt: Date }> =
    new Map();

  constructor(private readonly prisma: PrismaService) {}

  @Get('csrf')
  getCsrfToken(@Res({ passthrough: true }) res: Response) {
    const csrfToken = crypto.randomBytes(32).toString('hex');
    const tokenId = crypto.randomBytes(8).toString('hex');

    this.csrfTokens.set(tokenId, {
      token: csrfToken,
      createdAt: new Date(),
    });

    res.cookie('csrf_token_id', tokenId, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24시간
      sameSite: 'strict',
    });

    return {
      status: 'success',
      data: {
        csrfToken,
      },
    };
  }

  @Post('signup')
  async signup(
    @Body() signupData: { email: string; password: string; csrfToken: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokenId =
      (req.cookies as Record<string, string | undefined>)['csrf_token_id'] ||
      undefined;

    if (!tokenId) {
      res.status(HttpStatus.BAD_REQUEST);
      return {
        status: 'error',
        message: 'CSRF 토큰이 없습니다.',
      };
    }

    const storedTokenData = this.csrfTokens.get(tokenId);

    if (!storedTokenData || storedTokenData.token !== signupData.csrfToken) {
      res.status(HttpStatus.BAD_REQUEST);
      return {
        status: 'error',
        message: '유효하지 않은 CSRF 토큰입니다.',
      };
    }

    this.csrfTokens.delete(tokenId);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(signupData.password, saltRounds);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: signupData.email,
          password: hashedPassword,
        },
      });

      res.status(HttpStatus.CREATED);
      return {
        status: 'success',
        data: {
          message: '회원가입 성공',
          userId: user.id,
        },
      };
    } catch (e) {
      res.status(HttpStatus.CONFLICT);
      return {
        status: 'error',
        message: '이미 존재하는 사용자입니다.',
      };
    }
  }

  @Post('login')
  async login(
    @Body() loginData: { email: string; password: string; csrfToken: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokenId =
      (req.cookies as Record<string, string | undefined>)['csrf_token_id'] ||
      undefined;

    if (!tokenId) {
      res.status(HttpStatus.BAD_REQUEST);
      return {
        status: 'error',
        message: 'CSRF 토큰이 없습니다.',
      };
    }

    const storedTokenData = this.csrfTokens.get(tokenId);

    if (!storedTokenData || storedTokenData.token !== loginData.csrfToken) {
      res.status(HttpStatus.BAD_REQUEST);
      return {
        status: 'error',
        message: '유효하지 않은 CSRF 토큰입니다.',
      };
    }

    this.csrfTokens.delete(tokenId);

    const user = await this.prisma.user.findUnique({
      where: { email: loginData.email },
    });

    if (!user) {
      res.status(HttpStatus.UNAUTHORIZED);
      return {
        status: 'error',
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      };
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password,
    );

    if (!isPasswordValid) {
      res.status(HttpStatus.UNAUTHORIZED);
      return {
        status: 'error',
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      };
    }

    return {
      status: 'success',
      data: {
        message: '로그인 성공',
      },
    };
  }
}
