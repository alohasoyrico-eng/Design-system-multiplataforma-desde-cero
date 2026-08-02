const {
  add,
  docsCssFile,
  docsStyleModuleFiles,
  path,
  read,
  readDocsCss,
  readJson,
  readSpec,
  resolveBoundaryPath,
  root,
} = require("./audit-context.js");

const energyContractFile = path.join(root, "docs/audits/energy-quality-contract.json");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");

function collectTokens(css) {
  const tokens = {};
  for (const match of css.matchAll(/(--(?:ref|sys|comp)-[a-z0-9-]+):\s*([^;]+);/g)) {
    if (!tokens[match[1]]) tokens[match[1]] = match[2].trim();
  }
  return tokens;
}

function normalizeHex(value) {
  const hex = String(value ?? "").trim().toLowerCase();
  if (hex === "#fff") return "#ffffff";
  if (hex === "#000") return "#000000";
  if (/^#[0-9a-f]{3}$/.test(hex)) return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  if (/^#[0-9a-f]{6}$/.test(hex)) return hex;
  return null;
}

function resolveTokenValue(value, tokens, seen = new Set()) {
  const direct = normalizeHex(value);
  if (direct) return direct;
  const token = String(value ?? "").match(/^var\((--[a-z0-9-]+)\)$/)?.[1] ?? (String(value ?? "").startsWith("--") ? value : "");
  if (!token || seen.has(token) || !tokens[token]) return null;
  seen.add(token);
  return resolveTokenValue(tokens[token], tokens, seen);
}

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((channel) => parseInt(channel, 16) / 255)
    .map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

function checkEnergyTokens(contract, css, tokens) {
  for (const token of contract.requiredTokenRoles ?? []) {
    if (!tokens[token]) add("errors", energyContractFile, 1, `Energy token role is missing: ${token}.`);
  }
  const tokenCss = read(tokenCssFile);
  for (const token of contract.requiredTokenRoles ?? []) {
    if (!tokenCss.includes(`${token}:`)) add("errors", tokenCssFile, 1, `Energy token must be declared by the token package: ${token}.`);
  }
  for (const file of docsStyleModuleFiles) {
    const source = read(file);
    for (const match of source.matchAll(/--ref-energy-[a-z0-9-]+(?=\s*:)/g)) {
      add("errors", file, source.slice(0, match.index).split("\n").length, `Docs must consume Energy tokens, not declare ${match[0]}.`);
    }
  }
  for (const pair of contract.requiredContrastPairs ?? []) {
    const background = resolveTokenValue(pair.background, tokens);
    const foreground = resolveTokenValue(pair.foreground, tokens);
    if (!background || !foreground) {
      add("errors", energyContractFile, 1, `Energy contrast pair cannot resolve: ${pair.label}.`);
      continue;
    }
    const ratio = contrastRatio(foreground, background);
    if (ratio < Number(pair.minimum ?? 4.5)) {
      add("errors", energyContractFile, 1, `${pair.label} contrast is ${ratio.toFixed(2)}:1; expected ${pair.minimum}:1.`);
    }
  }

  if (!/--sys-energy-action-primary:\s*var\(--ref-energy-blue-500\);/.test(css)) {
    add("errors", docsCssFile, 1, "Primary action must resolve to the Design System blue-500 Energy role.");
  }
  if (!/--sys-energy-status-warning:\s*var\(--ref-energy-yellow-400\);/.test(css)) {
    add("errors", docsCssFile, 1, "Warning status must resolve to yellow-400 for filled contrast with neutral-900.");
  }
  if (!/--sys-energy-status-warning-foreground:\s*var\(--ref-energy-yellow-900\);/.test(css)) {
    add("errors", docsCssFile, 1, "Warning foreground must resolve to yellow-900 for text, icon, border, and progress contrast.");
  }
}

function checkEnergySpec() {
  const energy = readSpec()?.artifacts?.foundations?.energy;
  const filled = energy?.filledStatusContrast ?? [];
  for (const id of ["action", "success", "warning", "danger"]) {
    if (!filled.some((item) => item.id === id && item.foreground && item.wcag)) {
      add("errors", energyContractFile, 1, `Energy filled status contrast decision missing or incomplete: ${id}.`);
    }
  }
}

function checkComponentEnergySemantics() {
  const componentSpecs = readSpec()?.artifacts?.components ?? {};
  const cssByName = new Map(
    docsStyleModuleFiles.map((file) => [path.basename(file), read(file)]),
  );

  for (const [component, spec] of Object.entries(componentSpecs)) {
    const serialized = JSON.stringify(spec);
    if (!serialized.includes("tone") && !serialized.includes("intent") && !serialized.includes("status")) continue;
    const energyCoverage = spec.foundations?.Energy;
    if (!energyCoverage?.tokens?.some((token) => token.includes("sys.energy") || token.includes("comp."))) {
      add("errors", energyContractFile, 1, `${component} exposes semantic tone/status but lacks Energy token coverage.`);
    }
  }

  const semanticComponentFiles = [
    ["badge", "04j-badge-docs.css"],
    ["tag", "04l-tag-docs.css"],
    ["toast", "04o-toast-docs.css"],
    ["inline-validation", "04p-inline-validation-docs.css"],
    ["progress-indicator", "04q-progress-indicator-docs.css"],
    ["dialog", "04s-dialog-docs.css"],
    ["menu", "04t-menu-docs.css"],
  ];

  for (const [component, fileName] of semanticComponentFiles) {
    const css = cssByName.get(fileName) ?? "";
    if (!css) continue;
    for (const [role, tokens] of [
      ["danger", ["--sys-energy-status-error"]],
      ["warning", ["--sys-energy-status-warning", "--sys-energy-status-warning-foreground"]],
      ["success", ["--sys-energy-status-success"]],
    ]) {
      if (css.includes(role) && !tokens.some((token) => css.includes(token))) {
        add("errors", path.join("apps/docs/styles", fileName), 1, `${component} ${role} tone must map to ${tokens.join(" or ")}.`);
      }
    }
  }
}

function checkEnergyContracts() {
  const contract = readJson(energyContractFile);
  if (!contract?.requiredTokenRoles?.length || !contract?.requiredContrastPairs?.length) {
    add("errors", energyContractFile, 1, "Energy quality contract must declare token roles and contrast pairs.");
    return;
  }
  const css = `${read(tokenCssFile)}\n${readDocsCss()}`;
  const tokens = collectTokens(css);
  checkEnergyTokens(contract, css, tokens);
  checkEnergySpec();
  checkComponentEnergySemantics();
}

module.exports = { checkEnergyContracts };
