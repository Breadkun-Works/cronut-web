module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
        browser: true,
        es6: true,
        node: true,
        jest: true
    },
    root: true,
    extends: [
        'eslint:recommended', // 기본 ESLint 추천 규칙
        'plugin:react/recommended', // React 추천 규칙
        'plugin:react-hooks/recommended', // React Hooks 규칙
        'plugin:@typescript-eslint/recommended', // TypeScript 추천 규칙
        'plugin:prettier/recommended', // Prettier와 통합
        'next/core-web-vitals' // Next.js 필수 규칙
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {
            jsx: true // JSX 지원
        },
        sourceType: 'module',
        tsconfigRootDir: __dirname
    },
    plugins: ['prettier', 'react', 'react-hooks', '@typescript-eslint'],
    rules: {
        // Prettier 통합
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
        // React 관련 규칙
        'react/react-in-jsx-scope': 'off', // Next.js는 React import 불필요
        'react/jsx-uses-react': 'off', // React 자동 사용
        // TypeScript 관련 규칙
        '@typescript-eslint/no-unused-vars': ['warn'], // 사용하지 않는 변수 경고
        '@typescript-eslint/explicit-module-boundary-types': 'off', // 함수 반환 타입 강제 안 함
        '@typescript-eslint/no-explicit-any': 'warn', // `any` 사용 시 경고
        '@typescript-eslint/no-empty-function': 'off', // 빈 함수 허용
        // 기타
        'no-unused-vars': 'off', // JavaScript 기본 unused-vars 비활성화 (TS만 사용),
        '@typescript-eslint/indent': 'off', // Prettier가 들여쓰기 처리
        '@typescript-eslint/no-extra-semi': 'off', // Prettier와 충돌 방지,
        '@typescript-eslint/no-unused-expressions': [
            'error',
            {
                allowShortCircuit: true, // Allows logical AND/OR expressions
                allowTernary: true // Allows ternary expressions
            }
        ]
    },
    settings: {
        react: {
            version: 'detect' // React 버전을 자동으로 감지
        }
        // 'import/external-module-folders': ['.yarn'] //pnp 사용할 경우에 필요함
    }
};
