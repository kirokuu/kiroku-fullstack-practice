"use client";

import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../../lib/axios-instance";
import { useRouter } from "next/navigation";
interface LoginProps {
  email: string;
  password: string;
  csrfToken: string;
}

export function useLogin() {
  const router = useRouter();
  const { mutateAsync, isPending, isError, error } = useMutation<
    boolean,
    Error,
    LoginProps
  >({
    mutationFn: async ({ email, password, csrfToken }) => {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
        csrfToken,
      });

      if (response.data.status === "success") {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        router.push("/");
        return true;
      } else {
        throw new Error(response.data.message || "로그인에 실패했습니다.");
      }
    },
  });

  return {
    login: mutateAsync,
    loading: isPending,
    error: isError ? error.message : null,
  };
}
