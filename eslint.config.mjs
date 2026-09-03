import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      // Declare all browser + Node globals to prevent 'X is not defined' errors
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        React: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      react: reactPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      // TypeScript
      ...ts.configs["recommended"].rules,
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",

      // React
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed in Next.js (React 17+)
      "react/prop-types": "off",
      "react/no-unescaped-entities": "warn",

      // General
      "no-undef": "off",       // TypeScript handles this; don't double-report
      "no-console": ["warn", { allow: ["error", "warn", "info"] }],
    },
    settings: {
      react: { version: "detect" },
    },
  },
  {
    // Ignore build output and tests for strict rules
    ignores: [".next/**", "node_modules/**", "src/tests/**"],
  },
];
