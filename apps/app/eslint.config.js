import { nextJsConfig } from "@tauriforge/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    ignores: ["src-tauri/**"],
    rules: {},
  },
];
