import js from "@eslint/js";
import react from "eslint-plugin-react";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx"],
    plugins: { react },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: "readonly",
        Promise: "readonly",
        window: "readonly",
        document: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["error", { "varsIgnorePattern": "^React$" }],
      "no-var": "error",
      "eqeqeq": "error",
      "no-console": "warn",
      "no-empty": "error",
      "no-unreachable": "error",
      "no-self-compare": "error",
    },
  },
];