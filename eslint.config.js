import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // .claude/skills holds third-party Claude Code skill reference scripts
  // (added by the "Add third-party marketing skills" commit) — standalone
  // tooling, not part of this app's source or build, and not written to
  // this repo's lint/format conventions. Linting them here was never
  // intentional; it just wasn't excluded when they were added.
  // .claude/worktrees holds full source checkouts for parallel background
  // agents (git worktree) — each one duplicates the entire src/ tree, so a
  // root-level `eslint .` without this exclusion multiplies every real
  // finding by however many worktrees happen to exist at the time.
  { ignores: ["dist", ".output", ".vinxi", ".claude/skills", ".claude/worktrees"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "server-only",
              message:
                "TanStack Start does not use the Next.js `server-only` package. Rename the module to `*.server.ts` or mark it with `@tanstack/react-start/server-only`.",
            },
          ],
        },
      ],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  eslintPluginPrettier,
);
