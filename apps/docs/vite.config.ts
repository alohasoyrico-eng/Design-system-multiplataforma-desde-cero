import { defineConfig, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5183,
    // Allow serving workspace files (packages/* sources and hoisted node_modules fonts).
    fs: { allow: [searchForWorkspaceRoot(process.cwd())] },
  },
});
