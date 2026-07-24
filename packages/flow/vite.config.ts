import { libConfig } from "../../build/vite-lib.mjs";

// Umbrella package. Fonts are shipped as a side-effect CSS export, not bundled here.
export default libConfig({
  entry: "src/index.ts",
  extraExternal: [/^@fontsource/, /^material-symbols/],
});
