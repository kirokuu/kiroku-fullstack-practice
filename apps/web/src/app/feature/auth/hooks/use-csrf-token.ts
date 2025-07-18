"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../lib/axios-instance";

export function useCsrfToken() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["csrfToken"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/csrf");
      if (response.data.status === "success") {
        return response.data.data.csrfToken;
      } else {
        throw new Error(
          response.data.message || "CSRF 토큰을 가져오는데 실패했습니다."
        );
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1, // 실패 시 1번 재시도
  });

  return {
    csrfToken: data,
    loading: isLoading,
    error: error ? error.message : null,
  };
}
