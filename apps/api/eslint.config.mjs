// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'node_modules/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'no-unused-vars': 'warn', // 사용하지 않는 변수 경고로 변경
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          // TypeScript 버전
          varsIgnorePattern: '^_', // _ 로 시작하는 변수는 무시
          argsIgnorePattern: '^_', // _ 로 시작하는 매개변수는 무시
          ignoreRestSiblings: true, // 구조 분해 할당의 나머지 형제 무시
        },
      ],
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      // 추가 완화 규칙
      '@typescript-eslint/no-explicit-any': 'warn', // any 타입 허용 (경고만)
      '@typescript-eslint/no-floating-promises': 'warn', // 비동기 함수 처리 완화
      '@typescript-eslint/require-await': 'warn', // async 함수에 await 필요 완화
      '@typescript-eslint/ban-ts-comment': 'warn', // @ts-ignore 등 허용 (경고만)
      '@typescript-eslint/no-empty-function': 'warn', // 빈 함수 허용 (경고만)
      '@typescript-eslint/no-misused-promises': 'warn', // Promise 오용 완화

      // 코드 스타일 관련 규칙 완화
      'no-console': 'off', // console 허용
      'prefer-const': 'warn', // const 사용 권장 (경고만)
    },
  },
);
