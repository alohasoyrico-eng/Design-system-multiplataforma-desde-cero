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
const jsonOutput = path.join(outputDir, "foundation-tone-cascade-audit.json");
const markdownOutput = path.join(outputDir, "foundation-tone-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const toneSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/foundations/tone.json");
const primitiveDir = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const dependencyMatrixFile = path.join(root, "docs/audits/foundation-dependency-matrix.json");

const requiredRoles = ["neutral", "assistive", "urgent", "repair", "confirm"];
const requiredTokens = [
  "--ref-tone-weight-neutral",
  "--ref-tone-weight-assistive",
  "--ref-tone-weight-urgent",
  "--ref-tone-weight-repair",
  "--sys-tone-neutral-color",
  "--sys-tone-assistive-color",
  "--sys-tone-urgent-color",
  "--sys-tone-repair-color",
  "--sys-tone-confirm-color",
  "--sys-tone-neutral-weight",
  "--sys-tone-assistive-weight",
  "--sys-tone-urgent-weight",
  "--sys-tone-repair-weight",
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

function isToneBoundaryToken(name) {
  return /^--(?:ref|sys)-tone-/.test(name)
    || /^--(?:ref|sys)-voice-/.test(name)
    || /^--(?:ref|sys)-energy-/.test(name)
    || /^--sys-color-(?:primary|accent|info|success|warning|danger|error|text|muted|surface|border)/.test(name)
    || /^--(?:component|comp|pattern|template)-/.test(name)
    || /^--[a-z0-9-]+-[a-z0-9-]*(?:tone|status|severity|feedback|validation|helper|error|warning|success|danger|confirm|urgent|repair|assistive)[a-z0-9-]*/.test(name);
}

function aliasResolvesToToneBoundary(name, customProperties, seen = new Set()) {
  if (isToneBoundaryToken(name)) return true;
  if (seen.has(name)) return false;
  seen.add(name);
  const values = customProperties.get(name) ?? [];
  if (!values.length) return false;
  return values.some((value) => {
    const deps = varNames(value);
    if (!deps.length) return /^(?:none|auto|inherit|initial|unset|transparent|currentColor|0|1)$/.test(value)
      || /^-?\d*\.?\d+(?:%|px|rem|em)?$/.test(value);
    return deps.some((dep) => aliasResolvesToToneBoundary(dep, customProperties, new Set(seen)));
  });
}

function valueResolvesToToneBoundary(value, customProperties) {
  const deps = varNames(value);
  if (!deps.length) return false;
  return deps.some((dep) => aliasResolvesToToneBoundary(dep, customProperties));
}

function collectCssDeclarations(source) {
  const declarations = [];
  const lines = source.split("\n");
  let pending = null;
  lines.forEach((lineText, index) => {
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
  return [...css.matchAll(/--(?:ref|sys)-tone-[a-z0-9-]+(?=\s*:)/g)].map((match) => match[0]);
}

function findDocsOwnedToneTokens(files) {
  const owned = [];
  for (const file of files) {
    const source = readIfExists(file);
    for (const match of source.matchAll(/--(?:ref|sys)-tone-[a-z0-9-]+(?=\s*:)/g)) {
      owned.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        token: match[0],
        status: "fail",
        reason: "Docs must consume package-owned Tone tokens, not redeclare them.",
      });
    }
  }
  return owned;
}

function isToneCssDeclaration(property, lineText) {
  if (/^--/.test(property)) return /(?:tone|urgent|repair|assistive|confirm|confirmation|severity|status|error|warning|success|danger|destructive|helper|validation|feedback|toast|alert)/i.test(property);
  return /^(?:color|background|background-color|border-color|outline-color|box-shadow|font-weight)$/.test(property)
    && /(?:tone|urgent|repair|assistive|confirm|confirmation|severity|status|error|warning|success|danger|destructive|helper|validation|feedback|toast|alert|sys-color-(?:danger|warning|success|info|accent)|sys-tone|sys-voice)/i.test(lineText);
}

function findToneCssDeclarations(file, source, customProperties) {
  const findings = [];
  for (const declaration of collectCssDeclarations(source)) {
    const lineText = declaration.raw;
    const property = declaration.property;
    if (!isToneCssDeclaration(property, lineText)) continue;
    const value = lineText.trim();
    if (!value || value.startsWith("/*")) continue;
    const line = declaration.line;
    const isTokenPackage = rel(file) === rel(tokenCssFile);
    if (isTokenPackage && /^\s*--(?:ref|sys)-/.test(lineText)) continue;
    const resolvesToTone = valueResolvesToToneBoundary(lineText, customProperties);
    const usesLocalAlias = /var\(--[a-z0-9-]+/.test(lineText);
    const stripped = lineText.replace(/var\([^)]*\)/g, "");
    const hasRawToneColor = /\b(?:color|background|background-color|border-color|outline-color|box-shadow)\s*:\s*(?:#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|\b(?:red|blue|green|yellow|orange|black|white)\b)/i.test(stripped);
    const hasRawToneWeight = /\bfont-weight\s*:\s*(?:[1-9]00|bold|normal|medium|semibold)\b/i.test(stripped);
    if (/^--/.test(property) && isToneBoundaryToken(property)) {
      findings.push({ file: rel(file), line, value, status: "pass", reason: "Tone styling is centralized behind a Tone, Voice, Energy, semantic color, or local tone alias." });
      continue;
    }
    if (resolvesToTone) {
      findings.push({ file: rel(file), line, value, status: "pass", reason: "Tone styling resolves through Tone, Voice, Energy, or component alias." });
      continue;
    }
    if (/^color\s*:\s*currentColor\s*(?:;|$)/.test(stripped)
      || /^(?:background|background-color|border-color|outline-color|box-shadow)\s*:\s*(?:none|transparent)\s*(?:;|$)/.test(stripped)) {
      findings.push({ file: rel(file), line, value, status: "pass", reason: "Tone-neutral reset." });
      continue;
    }
    const status = hasRawToneColor || hasRawToneWeight ? "fail" : usesLocalAlias ? "review" : "review";
    findings.push({
      file: rel(file),
      line,
      value,
      status,
      reason: status === "fail"
        ? "Tone-related styling bypasses Tone, Voice, Energy, or component aliases with raw color or type weight."
        : "Tone-related styling needs trace to Tone, Voice, Energy, or component alias.",
    });
  }
  return findings;
}

function findToneCopyReviews() {
  const files = [
    ...walkFiles(path.join(root, "apps/docs"), (file) => /\.(?:js|json|md)$/.test(file) && !file.includes(`${path.sep}generated${path.sep}`) && !file.includes(`${path.sep}vendor${path.sep}`)),
    ...walkFiles(path.join(root, "packages/components/src"), (file) => file.endsWith(".js")),
  ];
  const reviews = [];
  const vagueCopyPattern = /\b(?:Something went wrong|Error occurred|Invalid|Failed|Try again|Success|Done|Warning)\b/g;
  for (const file of files) {
    const source = readIfExists(file);
    for (const match of source.matchAll(vagueCopyPattern)) {
      const currentLine = source.slice(source.lastIndexOf("\n", match.index) + 1, source.indexOf("\n", match.index) === -1 ? source.length : source.indexOf("\n", match.index));
      if (/\b(?:label|status|value|actionLabel|variant|tone)\s*:/.test(currentLine)) continue;
      if (/Try again or use the fallback/i.test(currentLine)) continue;
      const window = source.slice(Math.max(0, match.index - 180), match.index + 180);
      if (!/(error|warning|success|toast|validation|helper|empty|dialog|panel|alert|status)/i.test(window)) continue;
      reviews.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        value: match[0],
        status: "review",
        reason: "Tone copy may be vague; verify consequence and next action before shipping.",
      });
    }
  }
  return reviews.slice(0, 200);
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const docsCssFiles = docsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const cssFiles = [componentCssFile, ...docsCssFiles].filter((file) => fs.existsSync(file));
  const spec = readJson(toneSpecFile)?.artifacts?.foundations?.tone;
  const matrix = readJson(dependencyMatrixFile);
  const dependencyEdges = (matrix.dependencies ?? []).filter((dependency) => dependency.from === "Tone" || dependency.to === "Tone");
  const tokenDecls = findTokenDeclarations(tokenCss);
  const customProperties = buildCustomPropertyMap([tokenCss, componentCss, ...docsCssFiles.map(readIfExists)]);
  const missingTokens = requiredTokens.filter((token) => !tokenCss.includes(`${token}:`));
  const roleIds = new Set((spec?.roles ?? []).map((role) => role.id));
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const docsOwnedToneTokens = findDocsOwnedToneTokens(docsCssFiles);
  const toneRefPattern = /Tone|tone|neutral|assistive|urgent|repair|confirm|confirmation|severity|status|helper|validation|feedback|toast|alert|sys\.tone|--sys-tone/i;
  const tokenUsePattern = /var\(--(?:ref|sys)-tone-[a-z0-9-]+|var\(--component-[a-z0-9-]*(?:tone|status|validation|feedback|message)[a-z0-9-]*|var\(--comp-[a-z0-9-]*(?:tone|status|validation|feedback|message)[a-z0-9-]*/g;
  const primitiveRefs = collectArtifactRefs(primitiveDir, toneRefPattern);
  const componentRefs = collectArtifactRefs(componentDir, toneRefPattern);
  const patternRefs = collectArtifactRefs(patternDir, toneRefPattern);
  const templateRefs = collectArtifactRefs(templateDir, toneRefPattern);
  const docsCssUse = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), tokenUsePattern), 0);
  const packageCssUse = countMatches(componentCss, tokenUsePattern);
  const cssFindings = cssFiles.flatMap((file) => findToneCssDeclarations(file, readIfExists(file), customProperties));
  const cssFailures = cssFindings.filter((finding) => finding.status === "fail");
  const cssReviews = cssFindings.filter((finding) => finding.status === "review");
  const copyReviews = findToneCopyReviews();
  const requiredEdges = ["Tone->Voice", "Tone->Energy"];
  const missingEdges = requiredEdges.filter((edge) => {
    const [from, to] = edge.split("->");
    return !dependencyEdges.some((dependency) => dependency.from === from && dependency.to === to);
  });

  const gaps = [];
  if (missingRoles.length) gaps.push(`Tone spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingTokens.length) gaps.push(`Token package is missing required Tone tokens: ${missingTokens.join(", ")}.`);
  if (docsOwnedToneTokens.length) gaps.push("Docs still declare Tone tokens instead of consuming package-owned tokens.");
  if (cssFailures.length) gaps.push("Some CSS tone declarations bypass Tone, Voice, Energy, or component aliases.");
  if (cssReviews.length) gaps.push("Some tone-related CSS declarations need trace review.");
  if (copyReviews.length) gaps.push("Some feedback/status copy needs tone review for consequence and next action.");
  if (missingEdges.length) gaps.push(`Foundation dependency matrix is missing Tone edges: ${missingEdges.join(", ")}.`);

  let status = "pass";
  if (missingRoles.length || missingTokens.length || docsOwnedToneTokens.length || cssFailures.length || missingEdges.length) status = "fail";
  else if (cssReviews.length || copyReviews.length || componentRefs.count < 1 || patternRefs.count < 1 || templateRefs.count < 1) status = "review";

  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    foundation: "Tone",
    status,
    principle: "Tone governs language temperature and semantic emphasis. It must delegate type weight to Voice and semantic color to Energy, then cascade into feedback, validation, status, and recovery without local copy or visual tone systems.",
    tokenOwnership: {
      tokenCss: rel(tokenCssFile),
      declarations: tokenDecls.length,
      requiredTokens,
      missingTokens,
      docsOwnedToneTokens,
    },
    specContract: {
      file: rel(toneSpecFile),
      roles: [...roleIds].sort(),
      missingRoles,
      tokenDependencies: spec?.tokenDependencies ?? [],
      primitiveDependencies: spec?.primitiveDependencies ?? [],
      componentDependencies: spec?.componentDependencies ?? [],
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
    toneCssDeclarations: {
      scannedFiles: cssFiles.map(rel),
      totalFindings: cssFindings.length,
      failures: cssFailures,
      reviews: cssReviews,
      passCount: cssFindings.length - cssFailures.length - cssReviews.length,
    },
    toneCopyReviews: copyReviews,
    missingDependencyEdges: missingEdges,
    gaps,
    nextActions: [
      "Replace raw tone-related colors and type weights with Tone, Voice, Energy, or component aliases.",
      "Review feedback/status copy so errors include recovery, urgent copy is reserved for risk, and confirmations name the resulting state.",
      "When a component is audited 1:1, verify visible tone, copy tone, semantic status, and dependency trace from this report.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# Tone Cascade Audit");
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
  else lines.push("- No fail-level Tone cascade gaps detected.");
  lines.push("");
  lines.push("## Tone CSS Failures");
  lines.push("");
  if (report.toneCssDeclarations.failures.length) {
    lines.push("| File | Line | Value |");
    lines.push("| --- | ---: | --- |");
    for (const finding of report.toneCssDeclarations.failures.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | \`${finding.value.replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No raw Tone CSS bypasses found in scanned CSS.");
  }
  lines.push("");
  lines.push("## Tone Trace Reviews");
  lines.push("");
  const reviews = [...report.toneCssDeclarations.reviews, ...report.toneCopyReviews];
  if (reviews.length) {
    lines.push("| File | Line | Value |");
    lines.push("| --- | ---: | --- |");
    for (const finding of reviews.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | \`${String(finding.value).replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No Tone trace reviews found.");
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
      console.error("Tone cascade audit is stale. Run: node packages/audit/scripts/report-foundation-tone-cascade.js");
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
    cssFailures: report.toneCssDeclarations.failures.length,
    cssTraceReviews: report.toneCssDeclarations.reviews.length,
    copyReviews: report.toneCopyReviews.length,
    missingDependencyEdges: report.missingDependencyEdges.length,
  }, null, 2));
}

main();
