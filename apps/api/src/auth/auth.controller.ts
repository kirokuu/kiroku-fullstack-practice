import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import * as crypto from 'crypto';

@Controller('api/auth')
export class AuthController {
  // CSRF 토큰을 저장할 맵 (실제 프로덕션에서는 Redis 등 사용 권장)
  private csrfTokens: Map<string, { token: string; createdAt: Date }> =
    new Map();

  @Get('csrf')
  getCsrfToken(@Res({ passthrough: true }) res: Response) {
    // 랜덤 CSRF 토큰 생성
    const csrfToken = crypto.randomBytes(32).toString('hex');
    const tokenId = crypto.randomBytes(8).toString('hex');

    // 토큰 저장 (유효시간 관리를 위해 생성 시간도 함께 저장)
    this.csrfTokens.set(tokenId, {
      token: csrfToken,
      createdAt: new Date(),
    });

    // 토큰 ID를 쿠키에 저장
    res.cookie('csrf_token_id', tokenId, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24시간
      sameSite: 'strict',
    });

    // 프론트엔드 코드와 일치하는 응답 형식 사용
    return {
      status: 'success',
      data: {
        csrfToken,
      },
    };
  }

  @Post('login')
  login(
    @Body() loginData: { email: string; password: string; csrfToken: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // CSRF 토큰 검증 로직
    const tokenId =
      (req.cookies as Record<string, string | undefined>)['csrf_token_id'] ||
      undefined;

    if (!tokenId) {
      return {
        status: 'error',
        message: 'CSRF 토큰이 없습니다.',
      };
    }

    const storedTokenData = this.csrfTokens.get(tokenId);

    if (!storedTokenData || storedTokenData.token !== loginData.csrfToken) {
      return {
        status: 'error',
        message: '유효하지 않은 CSRF 토큰입니다.',
      };
    }

    // 토큰 사용 후 삭제 (일회용)
    this.csrfTokens.delete(tokenId);

    return {
      status: 'success',
      data: {
        message: '로그인 성공',
      },
    };
  }
}
