import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import pluginQuery from '@tanstack/eslint-plugin-query'


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintPluginPrettierRecommended.configs.recommended,
  pluginQuery.configs["flat/recommended"],
  globalIgnores([
    "node_modules/*",
    "src/server/var/**/*",
    "src/client/dist/**/*",
  ]),
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-imports": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);
