'use client';

import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../../../lib/axios-instance';

interface SignupProps {
  email: string;
  password: string;
  csrfToken: string;
}

export function useSignup() {
  const { mutateAsync, isPending, isError, error } = useMutation<boolean, Error, SignupProps>({
    mutationFn: async ({ email, password, csrfToken }) => {
      const response = await axiosInstance.post('/auth/signup', {
        email,
        password,
        csrfToken,
      });

      if (response.data.status === 'success') {
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        window.location.href = '/login';
        return true;
      } else {
        throw new Error(response.data.message || '회원가입에 실패했습니다.');
      }
    },
  });

  return { signup: mutateAsync, loading: isPending, error: isError ? error.message : null };
}

