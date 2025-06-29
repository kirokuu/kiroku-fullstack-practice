"use client";

import { useState } from "react";
import { Button } from "@kiroku/ui";
import axiosInstance from "@/lib/axios-instance";
// 결과를 보여주는 간단한 컴포넌트
const ResultDisplay = ({
  title,
  loading,
  data,
  error,
}: {
  title: string;
  loading: boolean;
  data: any;
  error: any;
}) => (
  <div className="mt-4 p-4 bg-gray-100 rounded-lg min-h-[150px]">
    <h3 className="font-semibold text-gray-700">{title}</h3>
    {loading && <p className="text-blue-500">Loading...</p>}
    {error && (
      <pre className="text-red-500 text-xs whitespace-pre-wrap">
        {JSON.stringify(error, null, 2)}
      </pre>
    )}
    {data && (
      <pre className="text-green-600 text-xs whitespace-pre-wrap">
        {JSON.stringify(data, null, 2)}
      </pre>
    )}
  </div>
);

export default function ApiTestPage() {
  // fetch 상태 관리
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchData, setFetchData] = useState<any>(null);
  const [fetchError, setFetchError] = useState<any>(null);

  // axios 상태 관리
  const [axiosLoading, setAxiosLoading] = useState(false);
  const [axiosData, setAxiosData] = useState<any>(null);
  const [axiosError, setAxiosError] = useState<any>(null);

  // --- Fetch 핸들러 ---
  const handleFetch = async (path: string, options?: RequestInit) => {
    setFetchLoading(true);
    setFetchData(null);
    setFetchError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${path}`,
        options
      );
      // fetch는 4xx, 5xx 에러를 catch로 보내지 않으므로 수동 처리 필요
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // 백엔드 응답이 text일 수 있으므로 try-catch로 JSON 파싱
      const data = await response.text();
      try {
        setFetchData(JSON.parse(data));
      } catch {
        setFetchData(data);
      }
    } catch (error: any) {
      setFetchError({ name: error.name, message: error.message });
    } finally {
      setFetchLoading(false);
    }
  };

  // --- Axios 핸들러 ---
  const handleAxios = async (
    method: "get" | "post",
    path: string,
    data?: any
  ) => {
    setAxiosLoading(true);
    setAxiosData(null);
    setAxiosError(null);
    try {
      // 'get' 또는 'post'를 동적으로 호출하도록 수정
      const response = await axiosInstance[method](path, data);
      setAxiosData(response.data);
    } catch (error: any) {
      // axios는 4xx, 5xx 에러를 자동으로 catch로 보냄
      setAxiosError(error.toJSON ? error.toJSON() : { message: error.message });
    } finally {
      setAxiosLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          Fetch vs. Axios API 호출 비교
        </h1>
        <p className="text-center text-gray-600 mb-8">
          네이티브 `fetch`와 라이브러리 `axios`의 차이점을 직접 테스트해보세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fetch 섹션 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              🔵 Fetch API
            </h2>
            <div className="space-y-3">
              <Button
                onClick={() => handleFetch("/test/hello")}
                className="w-full"
              >
                GET 요청 (성공)
              </Button>
              <Button
                onClick={() => handleFetch("/test/not-found")}
                variant="outline"
                className="w-full"
              >
                GET 요청 (404 실패)
              </Button>
              <Button
                onClick={() =>
                  handleFetch("/test/hello", {
                    method: "POST",
                    body: JSON.stringify({ name: "fetch" }),
                    headers: { "Content-Type": "application/json" },
                  })
                }
                variant="ghost"
                className="w-full"
              >
                POST 요청
              </Button>
            </div>
            <ResultDisplay
              title="Fetch 결과"
              loading={fetchLoading}
              data={fetchData}
              error={fetchError}
            />
            <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
              <h4 className="font-bold">Fetch 특징:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>브라우저 내장 기능이라 별도 설치 불필요.</li>
                <li>
                  4xx, 5xx 같은 HTTP 에러를 에러로 간주하지 않음.
                  `response.ok`로 직접 확인 필요.
                </li>
                <li>
                  응답 데이터를 사용하려면 `.json()`, `.text()` 등으로 직접
                  파싱해야 함.
                </li>
                <li>요청 취소, 타임아웃 등 부가 기능이 없음.</li>
              </ul>
            </div>
          </div>

          {/* Axios 섹션 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">
              🟣 Axios
            </h2>
            <div className="space-y-3">
              <Button
                onClick={() => handleAxios("get", "/test/hello")}
                className="w-full"
              >
                GET 요청 (성공)
              </Button>
              <Button
                onClick={() => handleAxios("get", "/test/not-found")}
                variant="outline"
                className="w-full"
              >
                GET 요청 (404 실패)
              </Button>
              <Button
                onClick={() =>
                  handleAxios("post", "/test/hello", { name: "axios" })
                }
                variant="ghost"
                className="w-full"
              >
                POST 요청
              </Button>
            </div>
            <ResultDisplay
              title="Axios 결과"
              loading={axiosLoading}
              data={axiosData}
              error={axiosError}
            />
            <div className="mt-4 p-4 bg-purple-50 text-purple-800 rounded-lg text-sm">
              <h4 className="font-bold">Axios 특징:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>라이브러리이므로 설치 필요 (`pnpm add axios`).</li>
                <li>
                  4xx, 5xx 에러를 자동으로 `catch` 블록으로 보내 에러 처리가
                  직관적.
                </li>
                <li>
                  응답 데이터를 자동으로 JSON으로 변환해 `response.data`에
                  담아줌.
                </li>
                <li>
                  요청/응답 인터셉터, 타임아웃, 요청 취소 등 강력한 부가 기능
                  제공.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
