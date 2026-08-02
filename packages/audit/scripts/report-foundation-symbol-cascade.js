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
const jsonOutput = path.join(outputDir, "foundation-symbol-cascade-audit.json");
const markdownOutput = path.join(outputDir, "foundation-symbol-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const symbolSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/foundations/symbol.json");
const primitiveDir = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const dependencyMatrixFile = path.join(root, "docs/audits/foundation-dependency-matrix.json");

const requiredRoles = ["action", "status", "warning", "danger", "domain", "illustration"];
const requiredTokens = [
  "--sys-symbol-family",
  "--sys-symbol-variation-filled",
  "--sys-symbol-variation-filled-strong",
  "--sys-symbol-variation-outline-strong",
  "--sys-symbol-size-sm",
  "--sys-symbol-size-md",
  "--sys-symbol-size-lg",
  "--sys-symbol-size-marker",
  "--sys-symbol-size-station",
  "--sys-symbol-size-display-sm",
  "--sys-symbol-size-display-md",
  "--sys-symbol-color-action",
  "--sys-symbol-color-status",
  "--sys-symbol-color-warning",
  "--sys-symbol-color-danger",
  "--sys-symbol-color-muted",
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

function isSymbolBoundaryToken(name) {
  return /^--(?:ref|sys)-symbol-/.test(name)
    || /^--sys-iconography-/.test(name)
    || /^--(?:ref|sys)-(?:energy|frame|voice|state|momentum|tone|a11y|depth)-/.test(name)
    || /^--(?:component|comp|pattern)-/.test(name)
    || /^--[a-z0-9-]+-[a-z0-9-]*(?:symbol|icon|glyph|illustration|logo|brand)[a-z0-9-]*/.test(name);
}

function aliasResolvesToSymbol(name, customProperties, seen = new Set()) {
  if (isSymbolBoundaryToken(name)) return true;
  if (seen.has(name)) return false;
  seen.add(name);
  const values = customProperties.get(name) ?? [];
  if (!values.length) return false;
  return values.some((value) => {
    const deps = varNames(value);
    if (!deps.length) return /^(?:none|auto|inherit|initial|unset|transparent|currentColor|0|1)$/.test(value)
      || /^-?\d*\.?\d+(?:%|px|rem|em|deg)?$/.test(value);
    return deps.some((dep) => aliasResolvesToSymbol(dep, customProperties, new Set(seen)));
  });
}

function valueResolvesToSymbol(value, customProperties) {
  const deps = varNames(value);
  if (!deps.length) return false;
  return deps.some((dep) => aliasResolvesToSymbol(dep, customProperties));
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

function findTokenDeclarations(css) {
  return [...css.matchAll(/--(?:ref|sys)-symbol-[a-z0-9-]+(?=\s*:)/g)].map((match) => match[0]);
}

function findDocsOwnedSymbolTokens(files) {
  const owned = [];
  for (const file of files) {
    const source = readIfExists(file);
    for (const match of source.matchAll(/--(?:ref|sys)-symbol-[a-z0-9-]+(?=\s*:)/g)) {
      owned.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        token: match[0],
        status: "fail",
        reason: "Docs must consume package-owned Symbol tokens, not redeclare them.",
      });
    }
  }
  return owned;
}

function isSymbolDeclaration(property, lineText) {
  if (/^--/.test(property)) {
    if (/(?:surface|background|bg|border|shadow|radius|avatar)/i.test(property) && !/(?:symbol|glyph|illustration|logo|brand)/i.test(property)) return false;
    return /(?:^--icon-|-(?:symbol|icon|glyph|illustration|logo|brand)(?:-|$))/i.test(property);
  }
  return /^(?:font-family|font-size|font-variation-settings|color|inline-size|block-size|min-inline-size|min-block-size|width|height)$/.test(property)
    && /(?:symbol|glyph|Material Symbols|illustration|logo|brand|--sys-font-icon|--sys-iconography|--sys-symbol)/i.test(lineText);
}

function findSymbolCssDeclarations(file, source, customProperties) {
  const findings = [];
  for (const declaration of collectCssDeclarations(source)) {
    const lineText = declaration.raw;
    if (!isSymbolDeclaration(declaration.property, lineText)) continue;
    const isTokenPackage = rel(file) === rel(tokenCssFile);
    if (isTokenPackage && /^\s*--(?:ref|sys)-/.test(lineText)) continue;
    const stripped = lineText.replace(/var\([^)]*\)/g, "");
    const isSymbolLocalCustomProperty = /^--icon-|-(?:symbol|icon|glyph|illustration|logo|brand)(?:-|$)/.test(declaration.property);
    const isAllowedVariationLiteral = isSymbolLocalCustomProperty
      && /(?:fill|weight|opsz|grade|variation)/i.test(declaration.property)
      && /^(?:--[a-z0-9-]+:\s*)?(?:currentColor|inherit|0|1|[1-9]\d{1,3})\s*;?$/.test(lineText.trim());
    const isAllowedInheritedColor = isSymbolLocalCustomProperty
      && /color/i.test(declaration.property)
      && /:\s*currentColor\s*;?$/.test(lineText.trim());
    const rawMaterialFamily = /font-family\s*:\s*var\(--ref-symbol-family-material\)|font-family\s*:\s*["']?Material Symbols/i.test(lineText);
    const rawColor = /\bcolor\s*:\s*(?:#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|\b(?:red|blue|green|yellow|black|white)\b)/i.test(stripped);
    const rawSize = /\b(?:font-size|inline-size|block-size|min-inline-size|min-block-size|width|height)\s*:\s*\d+(?:\.\d+)?(?:px|rem)\b/.test(stripped)
      && /(?:symbol|icon|glyph|illustration|avatar|logo|brand)/i.test(lineText);
    const resolves = valueResolvesToSymbol(lineText, customProperties);
    const status = isAllowedVariationLiteral || isAllowedInheritedColor
      ? "pass"
      : rawMaterialFamily || rawColor || rawSize
      ? "fail"
      : resolves || /var\(--(?:sys-symbol|sys-iconography|component|comp|pattern)-/.test(lineText)
        ? "pass"
        : /var\(--[a-z0-9-]+/.test(lineText)
          ? "review"
          : "fail";
    findings.push({
      file: rel(file),
      line: declaration.line,
      property: declaration.property,
      value: lineText.trim(),
      status,
      reason: status === "pass"
        ? "Symbol styling resolves through Symbol/Iconography or a component/pattern alias."
        : status === "review"
          ? "Symbol styling uses a local alias that must be traceable to Symbol/Iconography."
          : "Symbol styling bypasses Symbol tokens or uses a raw reference directly.",
    });
  }
  return findings;
}

function findSymbolOnlyRisks() {
  const docsFiles = [
    ...walkFiles(path.join(root, "packages/specs/specs/unison-system/artifacts/components"), (file) => file.endsWith(".json") && path.relative(componentDir, file).split(path.sep).length === 1),
    ...walkFiles(path.join(root, "packages/content/content/pattern-contracts/patterns"), (file) => file.endsWith(".md")),
  ];
  const risks = [];
  const symbolOnlyPattern = /(?:icon-only|symbol-only|flag-only|pixels-only|color-only|icon replaces|symbol replaces|no visible label|without replacing text|visible label|fallback)/ig;
  for (const file of docsFiles) {
    const source = readIfExists(file);
    if (!/(?:Symbol|sys\.symbol|symbol-only|flag-only|illustration|fallback)/i.test(source)) continue;
    if (/(?:tokenDependencies|tokens)[\s\S]{0,200}(?:sys\.symbol|sys-symbol)/i.test(source)
      && !/(?:Symbol|illustration|icon|glyph|flag|symbol-only|icon-only|flag-only)[\s\S]{0,200}(?:rejectIf|behavior|test|rule|decision)/i.test(source)) continue;
    const mentionsFallback = /\bfallback\b|visible label|without replacing text|never replace|does not replace|required.*text|text remains required|symbol-only|icon-only|flag-only|optional (?:tab )?icons?|icons? (?:are )?parent-only|labels? remain|parent .*icon, label/i.test(source);
    if (mentionsFallback) continue;
    const match = symbolOnlyPattern.exec(source);
    risks.push({
      file: rel(file),
      line: match ? lineNumber(source, match.index) : 1,
      status: "review",
      reason: "Symbol-bearing artifact should state that symbols support text and must have fallback/visible meaning.",
    });
  }
  return risks.slice(0, 80);
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const symbolSpec = readJson(symbolSpecFile)?.artifacts?.foundations?.symbol;
  const dependencyMatrix = readJson(dependencyMatrixFile);
  const dependencyEdges = (dependencyMatrix.dependencies ?? []).filter((dependency) => dependency.from === "Symbol" || dependency.to === "Symbol");
  const docsCssFiles = docsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const cssFiles = [componentCssFile, ...docsCssFiles].filter((file) => fs.existsSync(file));
  const customProperties = buildCustomPropertyMap([tokenCss, ...cssFiles.map((file) => readIfExists(file))]);
  const symbolFindings = cssFiles.flatMap((file) => findSymbolCssDeclarations(file, readIfExists(file), customProperties));
  const cssFailures = symbolFindings.filter((finding) => finding.status === "fail");
  const cssReviews = symbolFindings.filter((finding) => finding.status === "review");
  const symbolDecls = findTokenDeclarations(tokenCss);
  const docsOwnedSymbolTokens = findDocsOwnedSymbolTokens(docsCssFiles);
  const symbolRefPattern = /Symbol|sys\.symbol|ref\.symbol|--sys-symbol|--ref-symbol|symbol\.domain|animated\.|illustration|fallback/i;
  const tokenUsePattern = /var\(--(?:ref|sys)-symbol-[a-z0-9-]+|var\(--sys-iconography-[a-z0-9-]+|var\(--(?:component|comp|pattern)-[a-z0-9-]*(?:symbol|icon|glyph|illustration|avatar|logo|brand)[a-z0-9-]*/g;
  const docsCssUse = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), tokenUsePattern), 0);
  const packageCssUse = countMatches(componentCss, tokenUsePattern);
  const primitiveRefs = collectArtifactRefs(primitiveDir, symbolRefPattern);
  const componentRefs = collectArtifactRefs(componentDir, symbolRefPattern);
  const patternRefs = collectArtifactRefs(patternDir, symbolRefPattern);
  const templateRefs = collectArtifactRefs(templateDir, symbolRefPattern);
  const roleIds = new Set((symbolSpec?.roles ?? []).map((role) => role.id));
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const missingTokens = requiredTokens.filter((token) => !tokenCss.includes(`${token}:`));
  const tokenDependencies = Array.isArray(symbolSpec?.tokenDependencies) ? symbolSpec.tokenDependencies : [];
  const primitiveDependencies = Array.isArray(symbolSpec?.primitiveDependencies) ? symbolSpec.primitiveDependencies : [];
  const componentDependencies = Array.isArray(symbolSpec?.componentDependencies) ? symbolSpec.componentDependencies : [];
  const symbolOnlyRisks = findSymbolOnlyRisks();

  const gaps = [];
  if (missingRoles.length) gaps.push(`Symbol spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingTokens.length) gaps.push(`Token package is missing required Symbol tokens: ${missingTokens.join(", ")}.`);
  if (docsOwnedSymbolTokens.length) gaps.push("Docs still declare Symbol tokens instead of consuming package-owned tokens.");
  if (cssFailures.length) gaps.push("Some CSS symbol declarations bypass Symbol/Iconography/component aliases.");
  if (cssReviews.length) gaps.push("Some CSS symbol declarations use local aliases that still need cascade tracing.");
  if (symbolOnlyRisks.length) gaps.push("Some Symbol-bearing artifacts need explicit text/fallback evidence.");
  if (!dependencyEdges.some((edge) => edge.from === "Symbol" && edge.to === "Energy")) gaps.push("Symbol->Energy dependency is missing from the foundation matrix.");
  if (!dependencyEdges.some((edge) => edge.from === "Iconography" && edge.to === "Symbol")) gaps.push("Iconography->Symbol dependency is missing from the foundation matrix.");

  let status = "pass";
  if (missingRoles.length || missingTokens.length || docsOwnedSymbolTokens.length || cssFailures.length) status = "fail";
  else if (cssReviews.length || symbolOnlyRisks.length || patternRefs.count < 1 || templateRefs.count < 1) status = "review";

  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    foundation: "Symbol",
    status,
    principle: "Symbol must govern visual metaphors, domain symbols, illustration rules, image/animation fallback, and its boundary with functional Iconography without changing Flow tokens for reference look and feel.",
    tokenOwnership: {
      tokenCss: rel(tokenCssFile),
      declarations: symbolDecls.length,
      requiredTokens,
      missingTokens,
      docsOwnedSymbolTokens,
    },
    specContract: {
      file: rel(symbolSpecFile),
      roles: [...roleIds].sort(),
      missingRoles,
      tokenDependencies,
      primitiveDependencies,
      componentDependencies,
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
    symbolCssDeclarations: {
      scannedFiles: cssFiles.map(rel),
      total: symbolFindings.length,
      failures: cssFailures,
      reviews: cssReviews,
      passCount: symbolFindings.length - cssFailures.length - cssReviews.length,
    },
    symbolFallbackReviews: symbolOnlyRisks,
    gaps,
    nextActions: [
      "Fix any fail-level Symbol ownership or raw-reference gap before primitives.",
      "Use Symbol for metaphor and illustration support; use Iconography for functional controls.",
      "When ZIP look and feel influences symbols, translate geometry, fallback, and motion through Flow foundations without changing Flow color tokens.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# Symbol Cascade Audit");
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
  for (const edge of report.dependencyEdges) {
    lines.push(`- ${edge.from} -> ${edge.to}: ${edge.reason}`);
  }
  lines.push("");
  lines.push("## Gaps");
  lines.push("");
  if (report.gaps.length) {
    for (const gap of report.gaps) lines.push(`- ${gap}`);
  } else {
    lines.push("- No fail-level Symbol cascade gaps detected.");
  }
  lines.push("");
  lines.push("## CSS Failures");
  lines.push("");
  if (report.symbolCssDeclarations.failures.length) {
    lines.push("| File | Line | Property | Value |");
    lines.push("| --- | ---: | --- | --- |");
    for (const finding of report.symbolCssDeclarations.failures.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | ${finding.property} | \`${finding.value.replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No raw Symbol styling bypasses found in scanned CSS.");
  }
  lines.push("");
  lines.push("## Fallback Reviews");
  lines.push("");
  if (report.symbolFallbackReviews.length) {
    lines.push("| File | Line | Reason |");
    lines.push("| --- | ---: | --- |");
    for (const finding of report.symbolFallbackReviews.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | ${finding.reason} |`);
    }
  } else {
    lines.push("- No Symbol fallback review blockers found.");
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
    const currentJson = readIfExists(jsonOutput);
    const currentMarkdown = readIfExists(markdownOutput);
    if (currentJson !== json || currentMarkdown !== markdown) {
      console.error("Symbol cascade audit is stale. Run: node packages/audit/scripts/report-foundation-symbol-cascade.js");
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
    cssFailures: report.symbolCssDeclarations.failures.length,
    cssReviews: report.symbolCssDeclarations.reviews.length,
    fallbackReviews: report.symbolFallbackReviews.length,
  }, null, 2));
}

main();
