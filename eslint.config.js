// eslint.config.js
//
// Baseline FIRST, guardrail fragment LAST.
//
// The Vite react-ts template now ships oxlint, not ESLint (SETUP step 3 removed
// it, so there is exactly one linter here). This file recreates the standard
// react-ts ESLint baseline — typescript-eslint, react-hooks, react-refresh —
// and then APPENDS eslint.presentation.js on top.
//
// Never drop presentationRules in as the whole config: that deletes react-hooks
// and typescript-eslint, and `--max-warnings=0` in CI becomes a green check
// over nothing. Verify with:
//   npx eslint --print-config src/flows/routes.tsx
// It must list BOTH react-hooks/rules-of-hooks and react/forbid-elements.

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";
import { presentationRules } from "./eslint.presentation.js";

export default tseslint.config([
  globalIgnores(["dist", "storybook-static"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: { ecmaVersion: 2020, globals: globals.browser },
  },
  ...presentationRules, // last, so its bans win any conflict
]);
