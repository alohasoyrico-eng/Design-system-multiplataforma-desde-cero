#!/usr/bin/env node

const {
  fs,
  path,
  root,
  docsStyleModuleFiles,
  read,
  readJson,
  resolveBoundaryPath,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");

const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "foundation-energy-cascade-audit.json");
const markdownOutput = path.join(outputDir, "foundation-energy-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const energySpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/foundations/energy.json");
const energyContractFile = path.join(root, "docs/audits/energy-quality-contract.json");
const primitiveDir = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const dependencyMatrixFile = path.join(root, "docs/audits/foundation-dependency-matrix.json");

function walkFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const output = [];
  for (const entry of fs.readdirSync(dir)) {
    const file = path.join(dir, entry);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) output.push(...walkFiles(file, predicate));
    else if (predicate(file)) output.push(file);
  }
  return output.sort();
}

function rel(file) {
  return path.relative(root, file);
}

function readIfExists(file) {
  return fs.existsSync(file) ? read(file) : "";
}

function lineNumber(source, index) {
  return source.slice(0, index).split("\n").length;
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function artifactId(file, baseDir) {
  return path.relative(baseDir, file).split(path.sep)[0].replace(/\.(?:json|md)$/, "");
}

function collectArtifactRefs(dir, pattern) {
  const ids = new Set();
  const sampleFiles = [];
  for (const file of walkFiles(dir, (item) => /\.(?:json|md)$/.test(item))) {
    const source = readIfExists(file);
    pattern.lastIndex = 0;
    if (!pattern.test(source)) continue;
    ids.add(artifactId(file, dir));
    if (sampleFiles.length < 12) sampleFiles.push(rel(file));
  }
  return { count: ids.size, ids: [...ids].sort(), sampleFiles };
}

function collectTokens(css) {
  const tokens = {};
  for (const match of css.matchAll(/(--(?:ref|sys|comp|component)-[a-z0-9-]+):\s*([^;]+);/g)) {
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

function findTokenDeclarations(css) {
  return [...css.matchAll(/--(?:ref|sys)-energy-[a-z0-9-]+(?=\s*:)/g)].map((match) => match[0]);
}

function buildCustomPropertyMap(cssSources) {
  const map = new Map();
  const declarationPattern = /(?<name>--[a-z0-9-]+)\s*:\s*(?<value>[^;]+);/g;
  for (const source of cssSources) {
    let match;
    while ((match = declarationPattern.exec(source))) {
      const values = map.get(match.groups.name) ?? [];
      values.push(match.groups.value.trim());
      map.set(match.groups.name, values);
    }
  }
  return map;
}

function varNames(value) {
  return [...String(value ?? "").matchAll(/var\(\s*(--[a-z0-9-]+)/g)].map((match) => match[1]);
}

function isEnergyCascadeToken(name) {
  return /^--(?:ref|sys)-energy-/.test(name);
}

function isNonColorValue(value) {
  return /^(?:none|inherit|initial|unset|revert|currentColor|0|1|transparent)$/i.test(String(value ?? "").trim());
}

function aliasResolvesToEnergy(name, customProperties, seen = new Set()) {
  if (isEnergyCascadeToken(name)) return true;
  if (seen.has(name)) return false;
  seen.add(name);
  const values = customProperties.get(name) ?? [];
  if (!values.length) return false;
  return values.some((value) => {
    if (isNonColorValue(value)) return true;
    const deps = varNames(value);
    if (!deps.length) return false;
    return deps.some((dep) => aliasResolvesToEnergy(dep, customProperties, new Set(seen)));
  });
}

function valueResolvesToEnergy(value, customProperties) {
  const deps = varNames(value);
  if (!deps.length) return false;
  return deps.every((dep) => aliasResolvesToEnergy(dep, customProperties));
}

function findDocsOwnedEnergyTokens(files) {
  const owned = [];
  for (const file of files) {
    const source = readIfExists(file);
    let match;
    const pattern = /--(?<layer>ref|sys)-energy-[a-z0-9-]+(?=\s*:)/g;
    while ((match = pattern.exec(source))) {
      const isAllowedThemeOverride = match.groups.layer === "sys" && path.basename(file) === "00-foundations-03.css";
      owned.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        token: match[0],
        status: isAllowedThemeOverride ? "pass" : "fail",
        reason: isAllowedThemeOverride ? "Theme context override for light/dark mode." : "Docs must consume Energy tokens, not own them.",
      });
    }
  }
  return owned;
}

function findRawColorDeclarations(file, source, customProperties) {
  const findings = [];
  const declarationPattern = /(?<property>color|background|background-color|border-color|outline-color|box-shadow|fill|stroke)\s*:\s*(?<value>[^;]+);/g;
  let match;
  while ((match = declarationPattern.exec(source))) {
    const property = match.groups.property;
    const value = match.groups.value.trim();
    const isRawHex = /#[0-9a-fA-F]{3,8}\b/.test(value);
    const isRgb = /\brgba?\(/.test(value);
    const isNamedColor = /\b(?:black|white|red|blue|green|yellow|gray|grey|transparent)\b/i.test(value) && !/color-mix|transparent/.test(value);
    const isDirectRefEnergy = /var\(--ref-energy-/.test(value);
    const isSemanticEnergy = /var\(--sys-energy-/.test(value);
    const isComponentAlias = /var\(--(?:comp|component|density|pattern)-/.test(value);
    const isResolvedAlias = /var\(--[a-z0-9-]+/.test(value) && valueResolvesToEnergy(value, customProperties);
    const isColorFunction = /currentColor|color-mix\(/.test(value);
    const isAllowedTransparent = value === "transparent";
    const isNonColorKeyword = isNonColorValue(value);
    if ((isSemanticEnergy || isComponentAlias || isResolvedAlias || isColorFunction || isAllowedTransparent || isNonColorKeyword) && !isDirectRefEnergy && !isRawHex && !isRgb && !isNamedColor) continue;
    if (property === "box-shadow" && /var\(--(?:sys|ref|component)-/.test(value)) continue;
    const status = (isRawHex || isRgb || isNamedColor || isDirectRefEnergy) ? "fail" : "review";
    findings.push({
      file: rel(file),
      line: lineNumber(source, match.index),
      property,
      value,
      status,
      reason: isDirectRefEnergy
        ? "Direct ref-energy ramp bypasses semantic Energy roles."
        : status === "fail"
          ? "Raw color bypasses Energy."
          : "Color declaration needs Energy trace.",
    });
  }
  return findings;
}

function contrastChecks(contract, tokens) {
  return (contract.requiredContrastPairs ?? []).map((pair) => {
    const background = resolveTokenValue(pair.background, tokens);
    const foreground = resolveTokenValue(pair.foreground, tokens);
    const ratio = background && foreground ? contrastRatio(foreground, background) : null;
    return {
      label: pair.label,
      background: pair.background,
      foreground: pair.foreground,
      minimum: pair.minimum,
      ratio: ratio == null ? null : Number(ratio.toFixed(2)),
      status: ratio != null && ratio >= Number(pair.minimum ?? 4.5) ? "pass" : "fail",
    };
  });
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const docsCssFiles = docsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const cssFiles = [componentCssFile, ...docsCssFiles].filter((file) => fs.existsSync(file));
  const customProperties = buildCustomPropertyMap([tokenCss, ...cssFiles.map((file) => readIfExists(file))]);
  const contract = readJson(energyContractFile);
  const spec = readJson(energySpecFile)?.artifacts?.foundations?.energy;
  const matrix = readJson(dependencyMatrixFile);
  const dependencyEdges = (matrix.dependencies ?? []).filter((dependency) => dependency.from === "Energy" || dependency.to === "Energy");
  const tokens = collectTokens(`${tokenCss}\n${docsCssFiles.map(readIfExists).join("\n")}`);
  const tokenDecls = findTokenDeclarations(tokenCss);
  const missingTokens = (contract.requiredTokenRoles ?? []).filter((token) => !tokenCss.includes(`${token}:`));
  const docsOwnedEnergyTokens = findDocsOwnedEnergyTokens(docsCssFiles);
  const illegalDocsOwnedEnergyTokens = docsOwnedEnergyTokens.filter((item) => item.status === "fail");
  const contrast = contrastChecks(contract, tokens);
  const failedContrast = contrast.filter((item) => item.status === "fail");
  const rawColorFindings = cssFiles.flatMap((file) => findRawColorDeclarations(file, readIfExists(file), customProperties));
  const rawColorFailures = rawColorFindings.filter((finding) => finding.status === "fail");
  const rawColorReviews = rawColorFindings.filter((finding) => finding.status === "review");
  const energyRefPattern = /Energy|sys\.energy|ref\.energy|--sys-energy|--ref-energy|--comp-[a-z0-9-]+-(?:color|bg|background|border|surface|text|tone|status|danger|warning|success|action)/i;
  const tokenUsePattern = /var\(--(?:ref|sys)-energy-[a-z0-9-]+|var\(--comp-[a-z0-9-]+-(?:color|bg|background|border|surface|text|tone|status|danger|warning|success|action)[a-z0-9-]*/g;
  const primitiveRefs = collectArtifactRefs(primitiveDir, energyRefPattern);
  const componentRefs = collectArtifactRefs(componentDir, energyRefPattern);
  const patternRefs = collectArtifactRefs(patternDir, energyRefPattern);
  const templateRefs = collectArtifactRefs(templateDir, energyRefPattern);
  const docsCssUse = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), tokenUsePattern), 0);
  const packageCssUse = countMatches(componentCss, tokenUsePattern);
  const roleIds = new Set((spec?.roles ?? []).map((role) => role.id));
  const requiredRoles = ["action", "success", "warning", "warningForeground", "error", "surface", "border"];
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const filledStatusContrast = spec?.filledStatusContrast ?? [];
  const missingFilledStatus = ["action", "success", "warning", "danger"].filter((id) => !filledStatusContrast.some((item) => item.id === id && item.foreground && item.wcag));
  const expectedPrimary = /--sys-energy-action-primary:\s*var\(--ref-energy-blue-500\);/.test(tokenCss);
  const expectedWarning = /--sys-energy-status-warning:\s*var\(--ref-energy-yellow-400\);/.test(tokenCss);
  const expectedWarningForeground = /--sys-energy-status-warning-foreground:\s*var\(--ref-energy-yellow-900\);/.test(tokenCss);

  const gaps = [];
  if (missingRoles.length) gaps.push(`Energy spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingTokens.length) gaps.push(`Token package is missing required Energy tokens: ${missingTokens.join(", ")}.`);
  if (illegalDocsOwnedEnergyTokens.length) gaps.push("Docs still declare Energy tokens outside allowed theme overrides.");
  if (failedContrast.length) gaps.push("Some required Energy contrast pairs fail or cannot resolve.");
  if (rawColorFailures.length) gaps.push("Some CSS color declarations use raw colors or direct ref-energy ramps instead of semantic Energy roles.");
  if (rawColorReviews.length) gaps.push("Some CSS color declarations need trace review.");
  if (missingFilledStatus.length) gaps.push(`Energy filled status contrast is incomplete for: ${missingFilledStatus.join(", ")}.`);
  if (!expectedPrimary) gaps.push("Primary action is not locked to ref-energy-blue-500.");
  if (!expectedWarning || !expectedWarningForeground) gaps.push("Warning filled/foreground roles are not locked to the expected Energy ramp.");
  for (const edge of ["State->Energy", "Tone->Energy", "Depth->Energy", "Growth->Energy", "Iconography->Energy", "Symbol->Energy"]) {
    const [from, to] = edge.split("->");
    if (!dependencyEdges.some((item) => item.from === from && item.to === to)) gaps.push(`Foundation dependency is missing: ${edge}.`);
  }

  let status = "pass";
  if (missingRoles.length || missingTokens.length || illegalDocsOwnedEnergyTokens.length || failedContrast.length || rawColorFailures.length || missingFilledStatus.length || !expectedPrimary || !expectedWarning || !expectedWarningForeground) status = "fail";
  else if (rawColorReviews.length || patternRefs.count < 1 || templateRefs.count < 1) status = "review";

  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    foundation: "Energy",
    status,
    principle: "Energy must govern semantic color for actions, status, risk, text, surfaces, borders, charts, and maps without changing Flow tokens to copy reference visuals.",
    tokenOwnership: {
      tokenCss: rel(tokenCssFile),
      declarations: tokenDecls.length,
      requiredTokens: contract.requiredTokenRoles ?? [],
      missingTokens,
      docsOwnedEnergyTokens,
    },
    specContract: {
      file: rel(energySpecFile),
      roles: [...roleIds].sort(),
      missingRoles,
      tokenDependencies: spec?.tokenDependencies ?? [],
      primitiveDependencies: spec?.primitiveDependencies ?? [],
      componentDependencies: spec?.componentDependencies ?? [],
      filledStatusContrast,
      missingFilledStatus,
    },
    dependencyEdges: dependencyEdges.map((edge) => ({
      from: edge.from,
      to: edge.to,
      status: edge.status ?? "active",
      reason: edge.reason,
    })),
    cascadeCoverage: {
      primitives: primitiveRefs,
      components: componentRefs,
      patterns: patternRefs,
      templates: templateRefs,
      packageCssDirectUses: packageCssUse,
      docsCssDirectUses: docsCssUse,
    },
    semanticLocks: {
      primaryActionBlue500: expectedPrimary,
      warningFilledYellow400: expectedWarning,
      warningForegroundYellow900: expectedWarningForeground,
    },
    contrast,
    colorDeclarations: {
      scannedFiles: cssFiles.map(rel),
      totalFindings: rawColorFindings.length,
      failures: rawColorFailures,
      reviews: rawColorReviews,
    },
    gaps,
    nextActions: [
      "Fix fail-level raw color or direct ref-energy semantic bypasses before touching the next foundation.",
      "Keep ZIP look and feel as semantic mapping evidence, not as permission to change Energy tokens.",
      "When a component is audited 1:1, verify action/status/surface roles against this report and rendered contrast.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# Energy Cascade Audit");
  lines.push("");
  lines.push(`Status: **${report.status}**`);
  lines.push("");
  lines.push(report.principle);
  lines.push("");
  lines.push("## Coverage");
  lines.push("");
  lines.push("| Layer | Count | Evidence |");
  lines.push("| --- | ---: | --- |");
  lines.push(`| Token declarations | ${report.tokenOwnership.declarations} | ${report.tokenOwnership.tokenCss} |`);
  lines.push(`| Primitive refs | ${report.cascadeCoverage.primitives.count} | ${report.cascadeCoverage.primitives.ids.join(", ") || "none"} |`);
  lines.push(`| Component refs | ${report.cascadeCoverage.components.count} | ${report.cascadeCoverage.components.ids.slice(0, 18).join(", ")}${report.cascadeCoverage.components.count > 18 ? "..." : ""} |`);
  lines.push(`| Pattern refs | ${report.cascadeCoverage.patterns.count} | ${report.cascadeCoverage.patterns.ids.slice(0, 18).join(", ")}${report.cascadeCoverage.patterns.count > 18 ? "..." : ""} |`);
  lines.push(`| Template refs | ${report.cascadeCoverage.templates.count} | ${report.cascadeCoverage.templates.ids.join(", ") || "none"} |`);
  lines.push(`| Package CSS direct uses | ${report.cascadeCoverage.packageCssDirectUses} | packages/components/styles/components.css |`);
  lines.push(`| Docs CSS direct uses | ${report.cascadeCoverage.docsCssDirectUses} | apps/docs/styles |`);
  lines.push("");
  lines.push("## Semantic Locks");
  lines.push("");
  lines.push(`- Primary action -> blue-500: ${report.semanticLocks.primaryActionBlue500 ? "pass" : "fail"}`);
  lines.push(`- Warning filled -> yellow-400: ${report.semanticLocks.warningFilledYellow400 ? "pass" : "fail"}`);
  lines.push(`- Warning foreground -> yellow-900: ${report.semanticLocks.warningForegroundYellow900 ? "pass" : "fail"}`);
  lines.push("");
  lines.push("## Contrast");
  lines.push("");
  lines.push("| Pair | Ratio | Minimum | Status |");
  lines.push("| --- | ---: | ---: | --- |");
  for (const item of report.contrast) {
    lines.push(`| ${item.label} | ${item.ratio ?? "unresolved"} | ${item.minimum} | ${item.status} |`);
  }
  lines.push("");
  lines.push("## Dependencies");
  lines.push("");
  for (const edge of report.dependencyEdges) lines.push(`- ${edge.from} -> ${edge.to}: ${edge.reason}`);
  lines.push("");
  lines.push("## Gaps");
  lines.push("");
  if (report.gaps.length) for (const gap of report.gaps) lines.push(`- ${gap}`);
  else lines.push("- No fail-level Energy cascade gaps detected.");
  lines.push("");
  lines.push("## Raw Color Failures");
  lines.push("");
  if (report.colorDeclarations.failures.length) {
    lines.push("| File | Line | Property | Value |");
    lines.push("| --- | ---: | --- | --- |");
    for (const finding of report.colorDeclarations.failures.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | ${finding.property} | \`${finding.value.replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No raw color bypasses found in scanned CSS.");
  }
  lines.push("");
  lines.push("## Color Trace Reviews");
  lines.push("");
  if (report.colorDeclarations.reviews.length) {
    lines.push("| File | Line | Property | Value |");
    lines.push("| --- | ---: | --- | --- |");
    for (const finding of report.colorDeclarations.reviews.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | ${finding.property} | \`${finding.value.replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No untraced color declarations found in scanned CSS.");
  }
  lines.push("");
  lines.push("## Next Actions");
  lines.push("");
  for (const action of report.nextActions) lines.push(`- ${action}`);
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function stableJson(report) {
  return `${JSON.stringify(report, null, 2)}\n`;
}

function main() {
  const report = createReport();
  const json = stableJson(report);
  const markdown = toMarkdown(report);
  if (checkMode) {
    if (readIfExists(jsonOutput) !== json || readIfExists(markdownOutput) !== markdown) {
      console.error("Energy cascade audit is stale. Run: node packages/audit/scripts/report-foundation-energy-cascade.js");
      process.exit(1);
    }
    return;
  }
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, markdown);
  console.log(JSON.stringify({
    status: report.status,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
    gaps: report.gaps.length,
    semanticBypassFailures: report.colorDeclarations.failures.length,
    colorTraceReviews: report.colorDeclarations.reviews.length,
  }, null, 2));
}

main();
