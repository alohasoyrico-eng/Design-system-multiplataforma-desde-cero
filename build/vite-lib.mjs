import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

/**
 * Shared library-build config for every publishable Flow React package.
 * - preserveModules keeps the src tree in dist → tree-shakeable, CSS resolves per module.
 * - react + @flowds/* (+ any extraExternal) are externalized; the consumer provides them.
 * - vite-plugin-dts emits .d.ts mirroring src.
 * - all imported CSS is extracted into a single dist/styles.css (consume via the "./css" export).
 */
export function libConfig({ entry, extraExternal = [] }) {
  return defineConfig({
    plugins: [react(), dts({ include: ["src"], exclude: ["**/*.test.*"], entryRoot: "src" })],
    build: {
      lib: { entry, formats: ["es"], cssFileName: "styles" },
      rollupOptions: {
        external: [/^react/, /^react-dom/, /^@flow\//, ...extraExternal],
        output: {
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].js",
          assetFileNames: "[name][extname]",
        },
      },
      sourcemap: true,
      emptyOutDir: true,
    },
  });
}
