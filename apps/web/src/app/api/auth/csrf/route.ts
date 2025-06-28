import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  try {
    // CSRF TOKEN
    const csrfToken = crypto.randomBytes(32).toString("hex");

    console.log("api/auth/login/route.ts - CSRF Token 생성:", csrfToken);

    const response = NextResponse.json({
      statue: "success",
      data: {
        csrfToken,
        expiresIn: 900, // 15분
      },
      message: "CSRF 토큰 생성 성공",
    });

    // CSRF 토큰을 httpOnly 쿠키에 저장
    response.cookies.set("csrf-token", csrfToken, {
      httpOnly: true, // js 로 접근 불가능
      secure: process.env.NODE_ENV === "production", // https에서만
      sameSite: "strict", // 다른 도메인 요청 차단 (csrf 공격 방지)
      maxAge: 60 * 15, // 쿠키 만료 시간 (15분)
      path: "/", // 모든 경로에서 쿠키 접근 허용
    });

    return response;
  } catch (error) {
    console.error("api/auth/login/route.ts - CSRF Token 생성 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "CSRF 토큰 생성 실패",
      },
      {
        status: 500,
      }
    );
  }
}
