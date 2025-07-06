'use client';

import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../../../lib/axios-instance';

interface LoginProps {
  email: string;
  password: string;
  csrfToken: string;
}

export function useLogin() {
  const { mutateAsync, isPending, isError, error } = useMutation<boolean, Error, LoginProps>({
    mutationFn: async ({ email, password, csrfToken }) => {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
        csrfToken,
      });

      if (response.data.status === 'success') {
        alert("로그인 성공!");
        // 성공 시 페이지 이동 등
        return true;
      } else {
        throw new Error(response.data.message || "로그인에 실패했습니다.");
      }
    },
  });

  return { login: mutateAsync, loading: isPending, error: isError ? error.message : null };
}
