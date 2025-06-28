import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// 임시 사용자 데이터
const MOCK_USERS = [
  {
    id: "1",
    email: "user@kiroku.com",
    password: "password123",
    name: "테스트 사용자",
    role: "user",
  },
  {
    id: "2",
    email: "admin@kiroku.com",
    password: "admin123",
    name: "관리자",
    role: "admin",
  },
];

export async function POST(request: NextRequest) {
  console.log("🚀 로그인 API 호출됨");

  try {
    // 1. 요청 바디 파싱
    const { email, password, csrfToken } = await request.json();
    console.log("📝 로그인 요청:", {
      email,
      csrfToken: csrfToken ? "있음" : "없음",
    });

    // 2. 필수 필드 검증
    if (!email || !password || !csrfToken) {
      return NextResponse.json(
        {
          success: false,
          message: "이메일, 비밀번호, CSRF 토큰이 모두 필요합니다.",
        },
        { status: 400 }
      );
    }

    // 3. CSRF 토큰 검증
    const cookieStore = cookies();
    const storedCsrfToken = cookieStore.get("csrf-token")?.value;

    console.log("🍪 토큰 비교:", {
      received: csrfToken,
      stored: storedCsrfToken,
    });

    if (!storedCsrfToken || csrfToken !== storedCsrfToken) {
      console.log("❌ CSRF 토큰 검증 실패");
      return NextResponse.json(
        {
          success: false,
          message: "CSRF 토큰이 유효하지 않습니다.",
        },
        { status: 403 }
      );
    }

    // 4. 사용자 인증
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      console.log("❌ 로그인 실패: 잘못된 이메일 또는 비밀번호");
      return NextResponse.json(
        {
          success: false,
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        },
        { status: 401 }
      );
    }

    // 5. JWT 토큰 생성 (라이브러리 사용!)
    const jwtSecret =
      process.env.JWT_SECRET || "fallback-secret-for-development";

    const jwtToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      jwtSecret,
      {
        expiresIn: "24h", // 24시간
        issuer: "kiroku-app", // 발급자
        audience: "kiroku-users", // 대상
      }
    );

    console.log("✅ JWT 토큰 생성 성공");

    // 6. 응답 생성
    const response = NextResponse.json({
      success: true,
      message: "로그인 성공",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token: jwtToken,
        expiresIn: 86400, // 24시간 (초 단위)
      },
    });

    // 7. JWT 토큰을 HttpOnly 쿠키에 저장
    response.cookies.set("auth-token", jwtToken, {
      httpOnly: true, // JavaScript로 접근 불가
      secure: process.env.NODE_ENV === "production", // HTTPS에서만
      sameSite: "strict", // CSRF 공격 방지
      maxAge: 60 * 60 * 24, // 24시간 (초 단위)
      path: "/", // 모든 경로에서 접근 가능
    });

    // 8. 사용된 CSRF 토큰 삭제 (일회용)
    response.cookies.delete("csrf-token");

    console.log("✅ 로그인 처리 완료:", { userId: user.id, email: user.email });
    return response;
  } catch (error) {
    console.error("❌ 로그인 API 오류:", error);
    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다.",
        error:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      {
        status: 500,
      }
    );
  }
}
