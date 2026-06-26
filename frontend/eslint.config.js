const js = require("@eslint/js");
const react = require("eslint-plugin-react");

module.exports = [
  js.configs.recommended,
  {
    plugins: { react },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        console: "readonly",
        Promise: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "error",
      "no-var": "error",
      "eqeqeq": "error",
      "no-console": "warn",
      "no-empty": "error",
      "no-unreachable": "error",
      "no-self-compare": "error",
    },
  },
];