import { createRequire } from "module";

const require = createRequire(import.meta.url);

const nextConfig = require("eslint-config-next");
const nextTypescriptConfig = require("eslint-config-next/typescript");
const prettierConfig = require("eslint-config-prettier");

const eslintConfig = [
  ...nextConfig,
  ...nextTypescriptConfig,
  prettierConfig,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-html-link-for-pages": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
    },
  },
];

export default eslintConfig;
