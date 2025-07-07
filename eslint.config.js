import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";

export default [
  js.configs.recommended,

  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["node_modules", "dist"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
      },
      globals: {
        React: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      react,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // TypeScript ESLint 권장 규칙들
      ...typescript.configs.recommended.rules,
      ...typescript.configs["recommended-requiring-type-checking"].rules,

      indent: ["error", 2],

      // React 관련
      "react/react-in-jsx-scope": "off",
      "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx", ".ts", ".tsx"] }],
      "react/prop-types": "off",

      // TypeScript 관련 (오류 검출을 위해 활성화)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",

      // 일반 JS 스타일
      "array-callback-return": "warn",
      eqeqeq: ["warn", "always"],
      "no-shadow": "off", // TypeScript 버전 사용
      "@typescript-eslint/no-shadow": "warn",
      "no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true }],
      "prefer-const": "warn",
      "prefer-template": "warn",
      "template-curly-spacing": ["error", "never"],
      "no-var": "error",
      "no-undef": "off",
      "prefer-arrow-callback": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "no-duplicate-imports": "warn",
      "newline-per-chained-call": ["warn", { ignoreChainWithDepth: 2 }],
    },
  },
];
