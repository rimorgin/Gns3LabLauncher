import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig, globalIgnores } from "eslint/config";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default defineConfig([
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    plugins: { react },
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
  ...pluginQuery.configs["flat/recommended"],
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  globalIgnores([
    "node_modules/*",
    "src/server/var/**/*",
    "src/client/dist/**/*",
  ]),
  {
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
]);
