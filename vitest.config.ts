// Vitest config. Targets the budget feature only — the rest of the
// rentblackbear codebase is a separate concern and shouldn't drag in
// here. Tests are colocated under `app/admin/budget/lib/__tests__/`
// so unit tests live next to the code they cover.

import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    include: ["app/admin/budget/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    environment: "node",
    globals: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["app/admin/budget/lib/**"],
      exclude: ["**/__tests__/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
});
