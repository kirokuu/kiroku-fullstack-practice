"use client";
import { useState } from "react";
import { useCsrfToken } from "../hooks/use-csrf-token";
import { useSignup } from "../hooks/use-sign-up";

export function SignupForm() {
  const { csrfToken, loading: csrfLoading, error: csrfError } = useCsrfToken();
  const { signup, loading: signupLoading, error: signupError } = useSignup();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (csrfError || !csrfToken) {
      return;
    }

    await signup({ email, password, csrfToken });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {(csrfError || signupError) && (
            <p className="text-red-500 text-center">
              {csrfError || signupError}
            </p>
          )}
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
              disabled={csrfLoading || signupLoading || !csrfToken}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {csrfLoading || signupLoading ? "가입 중..." : "회원가입"}
            </button>
          </div>

          <div className="text-sm text-center">
            <a href="/login" className="font-medium text-gray-500">
              이미 계정이 있으신가요?{" "}
              <span className="text-indigo-600 hover:text-indigo-500">
                로그인
              </span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
