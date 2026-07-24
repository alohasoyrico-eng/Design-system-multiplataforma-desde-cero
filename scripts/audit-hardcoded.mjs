#!/usr/bin/env node
/**
 * audit-hardcoded — machine-verifies the "cero hardcode" rule across the design system.
 *
 * Scans the consuming layers (primitives, components, patterns, templates) — NOT packages/tokens,
 * which is the single source of truth and the only place absolute values may live.
 *
 * Fails (exit 1) on, in CSS and/or TSX:
 *   - raw hex colors / rgb()/rgba()/hsl()/hsla() literals
 *   - hardcoded z-index integers
 *   - raw time literals (ms/s) in animation/transition/*duration* (must be a --sys-motion-* token)
 *   - magic opacity (anything but 0 or 1 → use --sys-opacity-*)
 *   - magic line-height (anything but 1 → use --sys-line-height-*) and letter-spacing em/px literals
 *   - raw px sizes on width/height/font-size (≥ 3px → use a size/container token)
 *   - --ref-* reach-through from components/patterns/templates CSS (must pass through sys/comp)
 *   - px / ms literals inside .tsx inline style values
 *
 * SVG coordinate-space files (Chart/MapCanvas/Donut/Sparkline) are exempt from the px check —
 * their numbers live in the chart's own viewBox units, not the CSS design scale.
 * Comments are stripped before scanning so explanatory notes never count as violations.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LAYERS = ["primitives", "components", "patterns", "templates"].map((p) =>
  join(ROOT, "packages", p),
);

const HEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;
const COLOR_FN = /\b(?:rgba?|hsla?)\s*\(/;
const ZINDEX = /z-index\s*:\s*-?\d+/;
const REF_REACH = /var\(\s*--ref-/;
const TSX_PX = /:\s*["'`]\s*-?\d*\.?\d+px\b/;
const TSX_MS = /:\s*["'`]\s*-?\d*\.?\d+ms\b/;
const COORD_FILE = /(Chart|MapCanvas|Donut|Sparkline)\.css$/;

function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}

/** Value of a CSS property on a single (formatted) line, or null. */
function propValue(line, prop) {
  const m = line.match(new RegExp(`(?:^|\\s|;)${prop}\\s*:\\s*([^;{}]+)`));
  return m ? m[1].trim() : null;
}

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (name === "node_modules" || name === "dist" || name === "coverage") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(css|tsx)$/.test(name)) out.push(full);
  }
  return out;
}

const violations = [];
function check(file, layerName) {
  const isCss = file.endsWith(".css");
  const coord = COORD_FILE.test(file);
  const raw = readFileSync(file, "utf8");
  const src = stripComments(raw);
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    const at = `${relative(ROOT, file)}:${i + 1}`;
    if (HEX.test(line)) violations.push(`${at}  raw hex color → use var(--sys-*/--comp-*)`);
    if (COLOR_FN.test(line)) violations.push(`${at}  color function literal → use a token`);

    if (isCss) {
      if (ZINDEX.test(line)) violations.push(`${at}  hardcoded z-index → use a token`);
      if (layerName !== "primitives" && REF_REACH.test(line))
        violations.push(`${at}  --ref-* reach-through → route through --sys-*/--comp-*`);

      // raw time literals inside animation/transition (catches the shorthand gap)
      if (/\b(animation|transition)\b/.test(line)) {
        const cleaned = line.replace(/var\([^)]*\)/g, "");
        if (/\b\d+\.?\d*m?s\b/.test(cleaned))
          violations.push(
            `${at}  raw time literal in ${/animation/.test(line) ? "animation" : "transition"} → use a --sys-motion-* token`,
          );
      }

      const op = propValue(line, "opacity");
      if (op && !op.includes("var(") && op !== "0" && op !== "1")
        violations.push(`${at}  magic opacity "${op}" → use --sys-opacity-*`);

      const lh = propValue(line, "line-height");
      if (lh && !lh.includes("var(") && lh !== "1")
        violations.push(`${at}  magic line-height "${lh}" → use --sys-line-height-*`);

      const ls = propValue(line, "letter-spacing");
      if (ls && !ls.includes("var(") && /-?[\d.]+(em|px|rem)/.test(ls))
        violations.push(`${at}  magic letter-spacing "${ls}" → use a tracking token`);

      // @media breakpoints are exempt: CSS media features cannot read custom properties, so the
      // literal must stay (breakpoint values have a canonical home in tokens for JS/SCSS/Dart).
      if (!coord && !line.trimStart().startsWith("@media")) {
        const sz = line.match(/(?:max-|min-)?(?:width|height|font-size)\s*:\s*(\d+(?:\.\d+)?)px/);
        if (sz && !line.includes("var(") && Number(sz[1]) >= 3)
          violations.push(`${at}  raw ${sz[1]}px size → use a size/container token`);
      }
    } else {
      if (TSX_PX.test(line)) violations.push(`${at}  px literal in inline style → use a token`);
      if (TSX_MS.test(line)) violations.push(`${at}  ms literal in inline style → use a token`);
    }
  });
}

for (const layer of LAYERS) {
  const layerName = layer.split("/").pop();
  for (const file of walk(layer)) check(file, layerName);
}

if (violations.length) {
  console.error(`\n✗ audit-hardcoded: ${violations.length} violation(s)\n`);
  for (const v of violations) console.error("  " + v);
  console.error("");
  process.exit(1);
}
console.log("✓ audit-hardcoded: 0 violations across primitives/components/patterns/templates.");
