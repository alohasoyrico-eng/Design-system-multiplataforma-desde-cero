#!/usr/bin/env node
/**
 * audit-hardcoded — machine-verifies the "cero hardcode" rule across the design system.
 *
 * Scans the consuming layers (primitives, components, patterns, templates) — NOT packages/tokens,
 * which is the single source of truth and the only place absolute values may live.
 *
 * Fails (exit 1) on:
 *   - raw hex colors (#abc / #aabbcc / #aabbccdd) in .css or .tsx
 *   - rgb()/rgba()/hsl()/hsla() literals
 *   - hardcoded z-index integers in CSS (must be a token)
 *   - px / ms literals inside .tsx inline style values (must be a token var)
 *   - --ref-* reach-through from components/patterns/templates CSS (must pass through sys/comp)
 *
 * Comments are stripped before scanning so explanatory notes (e.g. a "44px" reference in a
 * CSS comment) never count as violations.
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

function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
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
  const raw = readFileSync(file, "utf8");
  const src = stripComments(raw);
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    const at = `${relative(ROOT, file)}:${i + 1}`;
    if (HEX.test(line)) violations.push(`${at}  raw hex color → use var(--sys-*/--comp-*)`);
    if (COLOR_FN.test(line)) violations.push(`${at}  color function literal → use a token`);
    if (isCss && ZINDEX.test(line)) violations.push(`${at}  hardcoded z-index → use a token`);
    if (isCss && layerName !== "primitives" && REF_REACH.test(line))
      violations.push(`${at}  --ref-* reach-through → route through --sys-*/--comp-*`);
    if (!isCss && TSX_PX.test(line))
      violations.push(`${at}  px literal in inline style → use a token`);
    if (!isCss && TSX_MS.test(line))
      violations.push(`${at}  ms literal in inline style → use a token`);
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
