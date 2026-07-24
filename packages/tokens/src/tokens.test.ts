import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { describe, it, expect } from "vitest";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const themes = JSON.parse(readFileSync(join(DIST, "themes.json"), "utf8")) as Record<
  string,
  Record<string, string>
>;
const css = readFileSync(join(DIST, "tokens.css"), "utf8");

// ---- WCAG relative-luminance contrast ----
function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}
function contrast(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
const isHex = (v: string) => /^#[0-9a-fA-F]{6}$/.test(v);

describe("token pipeline integrity", () => {
  it("resolves every token — no undefined leaks into the CSS", () => {
    expect(css).not.toContain("undefined");
  });

  it("emits the three themes and the density scopes", () => {
    for (const sel of [
      '[data-theme="canvas"]',
      '[data-theme="asphalt"]',
      '[data-theme="brutal"]',
    ]) {
      expect(css).toContain(sel);
    }
    expect(css).toContain('[data-density="compact"]');
    expect(css).toContain('[data-density="comfortable"]');
  });

  it("keeps the comp layer bound to sys (no --ref-* directly under comp names)", () => {
    // Every comp token must reference a sys token, never a ref token.
    const compLines = css.split("\n").filter((l) => /^\s*--comp-/.test(l));
    expect(compLines.length).toBeGreaterThan(0);
    for (const line of compLines) {
      if (line.includes("var(")) expect(line).toMatch(/var\(--sys-/);
    }
  });
});

describe("WCAG AA text contrast across themes", () => {
  const pairs: Array<[string, string, number]> = [
    ["sys.text.primary", "sys.surface.canvas", 4.5],
    ["sys.text.primary", "sys.surface.card", 4.5],
    ["sys.text.secondary", "sys.surface.card", 4.5],
    ["sys.status.successText", "sys.status.successBg", 4.5],
    ["sys.text.onAccent", "sys.action.accent", 3.0], // button text is bold ≥14px → large-text threshold
  ];

  for (const theme of Object.keys(themes)) {
    for (const [fg, bg, min] of pairs) {
      it(`${theme}: ${fg} on ${bg} ≥ ${min}:1`, () => {
        const f = themes[theme][fg];
        const b = themes[theme][bg];
        if (!isHex(f) || !isHex(b)) return; // skip alpha/rgba pairs
        expect(contrast(f, b)).toBeGreaterThanOrEqual(min);
      });
    }
  }
});
