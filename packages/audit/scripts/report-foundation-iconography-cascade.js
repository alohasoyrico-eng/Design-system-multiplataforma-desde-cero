#!/usr/bin/env node

const {
  docsStyleModuleFiles,
  fs,
  path,
  read,
  readJson,
  resolveBoundaryPath,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");

const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "foundation-iconography-cascade-audit.json");
const markdownOutput = path.join(outputDir, "foundation-iconography-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const iconographySpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/foundations/iconography.json");
const primitiveDir = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const dependencyMatrixFile = path.join(root, "docs/audits/foundation-dependency-matrix.json");

const requiredRoles = ["action", "navigation", "status", "object", "size", "accessibility"];
const requiredTokens = [
  "--sys-iconography-family",
  "--sys-iconography-size-sm",
  "--sys-iconography-size-md",
  "--sys-iconography-size-lg",
  "--sys-iconography-color-action",
  "--sys-iconography-color-navigation",
  "--sys-iconography-color-status",
  "--sys-iconography-color-warning",
  "--sys-iconography-color-danger",
  "--sys-iconography-color-muted",
  "--sys-iconography-color-disabled",
  "--sys-iconography-touch-target-min",
  "--sys-iconography-focus-ring",
  "--sys-iconography-focus-offset",
];

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

function artifactId(file, baseDir) {
  return path.relative(baseDir, file).split(path.sep)[0].replace(/\.(?:json|md)$/, "");
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
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

function isIconographyBoundaryToken(name) {
  return /^--sys-iconography-/.test(name)
    || /^--(?:ref|sys)-symbol-/.test(name)
    || /^--(?:ref|sys)-(?:a11y|energy|frame|voice|state|momentum)-/.test(name)
    || /^--sys-font-icon$/.test(name)
    || /^--icon-/.test(name)
    || /^--(?:component|comp|pattern)-/.test(name)
    || /^--[a-z0-9-]+-[a-z0-9-]*(?:icon|glyph|symbol)[a-z0-9-]*/.test(name);
}

function aliasResolvesToIconographyBoundary(name, customProperties, seen = new Set()) {
  if (isIconographyBoundaryToken(name)) return true;
  if (seen.has(name)) return false;
  seen.add(name);
  const values = customProperties.get(name) ?? [];
  if (!values.length) return false;
  return values.some((value) => {
    const deps = varNames(value);
    if (!deps.length) return /^(?:none|auto|inherit|initial|unset|transparent|0|1)$/.test(value)
      || /^-?\d*\.?\d+(?:%|px|rem|em|deg)?$/.test(value);
    return deps.some((dep) => aliasResolvesToIconographyBoundary(dep, customProperties, new Set(seen)));
  });
}

function valueResolvesToIconographyBoundary(value, customProperties) {
  const deps = varNames(value);
  if (!deps.length) return false;
  return deps.some((dep) => aliasResolvesToIconographyBoundary(dep, customProperties));
}

function collectCssDeclarations(source) {
  const declarations = [];
  const lines = source.split("\n");
  let pending = null;
  let inFontFace = false;
  lines.forEach((lineText, index) => {
    if (/@font-face/.test(lineText)) inFontFace = true;
    if (inFontFace && /}/.test(lineText)) {
      inFontFace = false;
      return;
    }
    if (inFontFace) return;
    const trimmed = lineText.trim();
    if (!pending) {
      const match = trimmed.match(/^((?:--)?[a-z-]+)\s*:\s*(.*)$/i);
      if (!match) return;
      pending = { line: index + 1, property: match[1], text: trimmed, raw: `${match[1]}: ${match[2]}` };
    } else {
      pending.text = `${pending.text} ${trimmed}`.trim();
      pending.raw = `${pending.raw} ${trimmed}`.trim();
    }
    if (trimmed.includes(";")) {
      declarations.push(pending);
      pending = null;
    }
  });
  return declarations;
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

function findTokenDeclarations(css) {
  return [...css.matchAll(/--sys-iconography-[a-z0-9-]+(?=\s*:)/g)].map((match) => match[0]);
}

function findDocsOwnedIconographyTokens(files) {
  const owned = [];
  for (const file of files) {
    const source = readIfExists(file);
    for (const match of source.matchAll(/--sys-iconography-[a-z0-9-]+(?=\s*:)/g)) {
      owned.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        token: match[0],
        status: "fail",
        reason: "Docs must consume package-owned Iconography tokens, not redeclare them.",
      });
    }
  }
  return owned;
}

function isIconographyCssLine(lineText) {
  return /(?:icon|glyph|symbol|font-variation-settings|Material Symbols|font-family|aria-hidden|touch-target)/i.test(lineText);
}

function isIconographyCssDeclaration(property, lineText) {
  if (/^--/.test(property)) return /(?:icon|glyph|symbol|touch-target)/i.test(property);
  return /^(?:font-family|font-size|font-variation-settings|color|inline-size|block-size|min-inline-size|min-block-size)$/.test(property)
    && /(?:icon|glyph|symbol|Material Symbols)/i.test(lineText);
}

function findIconographyCssDeclarations(file, source, customProperties) {
  const findings = [];
  for (const declaration of collectCssDeclarations(source)) {
    const lineText = declaration.raw;
    const property = declaration.property;
    if (!isIconographyCssDeclaration(property, lineText)) continue;
    const value = lineText.trim();
    if (!value || value.startsWith("/*")) continue;
    const line = declaration.line;
    const isTokenPackage = rel(file) === rel(tokenCssFile);
    if (isTokenPackage && /^\s*--(?:ref|sys)-/.test(lineText)) continue;
    const resolvesToIconography = valueResolvesToIconographyBoundary(lineText, customProperties);
    const usesLocalAlias = /var\(--[a-z0-9-]+/.test(lineText);
    const stripped = lineText.replace(/var\([^)]*\)/g, "");
    const hasRawIconSize = /\b(?:font-size|inline-size|block-size|min-inline-size|min-block-size)\s*:\s*\d+(?:\.\d+)?(?:px|rem)\b/.test(stripped) && /icon|symbol|glyph/i.test(lineText);
    const hasRawFontVariation = /font-variation-settings\s*:\s*["'][A-Z]+["']/.test(stripped);
    const hasRawIconFamily = /font-family\s*:\s*["']?Material Symbols/i.test(stripped);
    const hasRawIconColor = /\bcolor\s*:\s*(?:#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|\b(?:red|blue|green|yellow|black|white)\b)/i.test(stripped);
    if (/^--/.test(property) && isIconographyBoundaryToken(property)) {
      findings.push({ file: rel(file), line, value, status: "pass", reason: "Iconography styling is centralized behind an Iconography, Symbol, component, pattern, or local icon alias." });
      continue;
    }
    if (resolvesToIconography) {
      findings.push({ file: rel(file), line, value, status: "pass", reason: "Iconography styling resolves through Iconography, Symbol, Accessibility, Energy, or component alias." });
      continue;
    }
    if (/^(?:inline-size|block-size|min-inline-size|min-block-size)\s*:\s*(?:0|auto|100%|max-content)\s*(?:;|$)/.test(stripped)
      || /^color\s*:\s*currentColor\s*(?:;|$)/.test(stripped)) {
      findings.push({ file: rel(file), line, value, status: "pass", reason: "Iconography-neutral layout reset." });
      continue;
    }
    const status = hasRawIconSize || hasRawFontVariation || hasRawIconFamily || hasRawIconColor ? "fail" : usesLocalAlias ? "review" : "review";
    findings.push({
      file: rel(file),
      line,
      value,
      status,
      reason: status === "fail"
        ? "Iconography styling bypasses foundation tokens with raw icon size, family, variation, or color."
        : "Iconography styling needs trace to Iconography, Symbol, Accessibility, or component alias.",
    });
  }
  return findings;
}

function findIconLiteralIssues() {
  const files = [
    ...walkFiles(path.join(root, "apps/docs"), (file) => /\.(?:js|json)$/.test(file) && !file.includes(`${path.sep}generated${path.sep}`)),
    ...walkFiles(path.join(root, "packages/components/src"), (file) => file.endsWith(".js")),
  ];
  const issues = [];
  for (const file of files) {
    const source = readIfExists(file);
    for (const match of source.matchAll(/(?:innerHTML|textContent)\s*=\s*["']([a-z0-9_ -]{2,})["']/gi)) {
      const value = match[1].trim();
      if (!/^[a-z0-9_]+$/.test(value)) continue;
      if (!/(icon|symbol|glyph|material)/i.test(source.slice(Math.max(0, match.index - 220), match.index + 220))) continue;
      issues.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        value,
        status: "review",
        reason: "Potential icon literal should route through the icon helper or registry.",
      });
    }
  }
  return issues.slice(0, 200);
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const docsCssFiles = docsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const cssFiles = [componentCssFile, ...docsCssFiles].filter((file) => fs.existsSync(file));
  const cssSources = [tokenCss, componentCss, ...docsCssFiles.map(readIfExists)];
  const customProperties = buildCustomPropertyMap(cssSources);
  const spec = readJson(iconographySpecFile)?.artifacts?.foundations?.iconography;
  const matrix = readJson(dependencyMatrixFile);
  const dependencyEdges = (matrix.dependencies ?? []).filter((dependency) => dependency.from === "Iconography" || dependency.to === "Iconography");
  const tokenDecls = findTokenDeclarations(tokenCss);
  const missingTokens = requiredTokens.filter((token) => !tokenCss.includes(`${token}:`));
  const roleIds = new Set((spec?.roles ?? []).map((role) => role.id));
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const docsOwnedIconographyTokens = findDocsOwnedIconographyTokens(docsCssFiles);
  const iconographyRefPattern = /Iconography|iconography|Icon Button|Material Symbols|glyph|symbol|icon-only|aria-hidden|aria-label|sys\.iconography|--sys-iconography/i;
  const tokenUsePattern = /var\(--sys-iconography-[a-z0-9-]+|var\(--component-[a-z0-9-]*(?:icon|glyph|symbol)[a-z0-9-]*|var\(--comp-[a-z0-9-]*(?:icon|glyph|symbol)[a-z0-9-]*/g;
  const primitiveRefs = collectArtifactRefs(primitiveDir, iconographyRefPattern);
  const componentRefs = collectArtifactRefs(componentDir, iconographyRefPattern);
  const patternRefs = collectArtifactRefs(patternDir, iconographyRefPattern);
  const templateRefs = collectArtifactRefs(templateDir, iconographyRefPattern);
  const docsCssUse = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), tokenUsePattern), 0);
  const packageCssUse = countMatches(componentCss, tokenUsePattern);
  const cssFindings = cssFiles.flatMap((file) => findIconographyCssDeclarations(file, readIfExists(file), customProperties));
  const cssFailures = cssFindings.filter((finding) => finding.status === "fail");
  const cssReviews = cssFindings.filter((finding) => finding.status === "review");
  const literalReviews = findIconLiteralIssues();
  const requiredEdges = ["Iconography->Symbol", "Iconography->Accessibility", "Iconography->Energy"];
  const missingEdges = requiredEdges.filter((edge) => {
    const [from, to] = edge.split("->");
    return !dependencyEdges.some((dependency) => dependency.from === from && dependency.to === to);
  });

  const gaps = [];
  if (missingRoles.length) gaps.push(`Iconography spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingTokens.length) gaps.push(`Token package is missing required Iconography tokens: ${missingTokens.join(", ")}.`);
  if (docsOwnedIconographyTokens.length) gaps.push("Docs still declare Iconography tokens instead of consuming package-owned tokens.");
  if (cssFailures.length) gaps.push("Some CSS iconography declarations bypass foundation tokens.");
  if (cssReviews.length) gaps.push("Some CSS iconography declarations need trace review.");
  if (literalReviews.length) gaps.push("Some JS icon literals need helper/registry trace review.");
  if (missingEdges.length) gaps.push(`Foundation dependency matrix is missing Iconography edges: ${missingEdges.join(", ")}.`);

  let status = "pass";
  if (missingRoles.length || missingTokens.length || docsOwnedIconographyTokens.length || cssFailures.length || missingEdges.length) status = "fail";
  else if (cssReviews.length || literalReviews.length || patternRefs.count < 1 || templateRefs.count < 1) status = "review";

  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    foundation: "Iconography",
    status,
    principle: "Iconography must govern functional glyph family, sizing, semantic color, optical alignment, touch/focus affordance, accessible names, and fallback behavior without creating a parallel symbol language.",
    tokenOwnership: {
      tokenCss: rel(tokenCssFile),
      declarations: tokenDecls.length,
      requiredTokens,
      missingTokens,
      docsOwnedIconographyTokens,
    },
    specContract: {
      file: rel(iconographySpecFile),
      roles: [...roleIds].sort(),
      missingRoles,
      tokenDependencies: spec?.tokenDependencies ?? [],
      primitiveDependencies: spec?.primitiveDependencies ?? [],
      componentDependencies: spec?.componentDependencies ?? [],
      patternDependencies: spec?.patternDependencies ?? [],
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
    iconographyCssDeclarations: {
      scannedFiles: cssFiles.map(rel),
      totalFindings: cssFindings.length,
      failures: cssFailures,
      reviews: cssReviews,
      passCount: cssFindings.length - cssFailures.length - cssReviews.length,
    },
    iconLiteralReviews: literalReviews,
    missingDependencyEdges: missingEdges,
    gaps,
    nextActions: [
      "Replace raw icon family, size, font variation, and color values with Iconography, Symbol, Accessibility, Energy, or component aliases.",
      "Review JS icon literals and route reusable glyphs through the icon helper or registry.",
      "When a component is audited 1:1, verify icon role, accessible naming, target/focus, density scaling, and non-icon-only meaning from this report.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# Iconography Cascade Audit");
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
  lines.push("## Dependencies");
  lines.push("");
  for (const edge of report.dependencyEdges) lines.push(`- ${edge.from} -> ${edge.to}: ${edge.reason}`);
  lines.push("");
  lines.push("## Gaps");
  lines.push("");
  if (report.gaps.length) for (const gap of report.gaps) lines.push(`- ${gap}`);
  else lines.push("- No fail-level Iconography cascade gaps detected.");
  lines.push("");
  lines.push("## Iconography CSS Failures");
  lines.push("");
  if (report.iconographyCssDeclarations.failures.length) {
    lines.push("| File | Line | Value |");
    lines.push("| --- | ---: | --- |");
    for (const finding of report.iconographyCssDeclarations.failures.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | \`${finding.value.replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No raw Iconography CSS bypasses found in scanned CSS.");
  }
  lines.push("");
  lines.push("## Iconography Trace Reviews");
  lines.push("");
  const reviews = [...report.iconographyCssDeclarations.reviews, ...report.iconLiteralReviews];
  if (reviews.length) {
    lines.push("| File | Line | Value |");
    lines.push("| --- | ---: | --- |");
    for (const finding of reviews.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | \`${String(finding.value).replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No Iconography trace reviews found.");
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
      console.error("Iconography cascade audit is stale. Run: node packages/audit/scripts/report-foundation-iconography-cascade.js");
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
    cssFailures: report.iconographyCssDeclarations.failures.length,
    cssTraceReviews: report.iconographyCssDeclarations.reviews.length,
    iconLiteralReviews: report.iconLiteralReviews.length,
    missingDependencyEdges: report.missingDependencyEdges.length,
  }, null, 2));
}

main();
