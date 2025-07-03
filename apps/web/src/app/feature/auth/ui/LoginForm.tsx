"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. 페이지 로드 시 CSRF 토큰 받아오기
  useEffect(() => {
    fetchCsrfToken();
  }, []);

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/csrf");
      const data = await response.json();

      if (data.status === "success") {
        setCsrfToken(data.data.csrfToken);
        console.log("✅ CSRF 토큰 받아옴:", data.data.csrfToken);
      }
    } catch (error) {
      console.error("❌ CSRF 토큰 요청 실패:", error);
    }
  };

  // 2. 로그인 제출 시 CSRF 토큰 포함
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!csrfToken) {
      alert("CSRF 토큰이 없습니다. 페이지를 새로고침해주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          csrfToken, // ← 여기서 토큰 포함!
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("✅ 로그인 성공:", result);
        // 로그인 성공 처리 (리다이렉트 등)
      } else {
        console.error("❌ 로그인 실패:", result);
        alert(result.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ 로그인 요청 오류:", error);
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="이메일"
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="비밀번호"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !csrfToken}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </div>

          {/* 개발용: CSRF 토큰 상태 표시 */}
          {process.env.NODE_ENV === "development" && (
            <div className="text-xs text-gray-500">
              CSRF Token: {csrfToken ? "✅ 로드됨" : "❌ 로딩 중..."}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
