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
const jsonOutput = path.join(outputDir, "foundation-growth-cascade-audit.json");
const markdownOutput = path.join(outputDir, "foundation-growth-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const growthSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/foundations/growth.json");
const primitiveDir = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternContractDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const patternCopyDir = path.join(root, "packages/content/content/pattern-copy/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const templateBlueprintFile = path.join(root, "packages/content/content/template-blueprints.json");
const dependencyMatrixFile = path.join(root, "docs/audits/foundation-dependency-matrix.json");

const requiredRoles = ["seed", "stable", "measured", "deprecated", "event"];
const requiredTokens = [
  "--ref-growth-stage-seed",
  "--ref-growth-stage-stable",
  "--ref-growth-stage-measured",
  "--ref-growth-stage-deprecated",
  "--sys-growth-stage-seed-color",
  "--sys-growth-stage-stable-color",
  "--sys-growth-stage-measured-color",
  "--sys-growth-stage-deprecated-color",
  "--sys-growth-event-font",
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

function isGrowthBoundaryToken(name) {
  return /^--(?:ref|sys)-growth-/.test(name)
    || /^--(?:ref|sys)-voice-/.test(name)
    || /^--(?:ref|sys)-energy-/.test(name)
    || /^--sys-color-(?:success|warning|danger|info|text|muted|surface|border)/.test(name)
    || /^--(?:component|comp|pattern|template)-/.test(name)
    || /^--[a-z0-9-]+-[a-z0-9-]*(?:growth|maturity|adoption|analytics|telemetry|stage|deprecated)[a-z0-9-]*/.test(name);
}

function aliasResolvesToGrowthBoundary(name, customProperties, seen = new Set()) {
  if (isGrowthBoundaryToken(name)) return true;
  if (seen.has(name)) return false;
  seen.add(name);
  const values = customProperties.get(name) ?? [];
  if (!values.length) return false;
  return values.some((value) => {
    const deps = varNames(value);
    if (!deps.length) return /^(?:none|auto|inherit|initial|unset|transparent|currentColor|0|1)$/.test(value)
      || /^-?\d*\.?\d+(?:%|px|rem|em)?$/.test(value);
    return deps.some((dep) => aliasResolvesToGrowthBoundary(dep, customProperties, new Set(seen)));
  });
}

function valueResolvesToGrowthBoundary(value, customProperties) {
  const deps = varNames(value);
  if (!deps.length) return false;
  return deps.some((dep) => aliasResolvesToGrowthBoundary(dep, customProperties));
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
  return [...css.matchAll(/--(?:ref|sys)-growth-[a-z0-9-]+(?=\s*:)/g)].map((match) => match[0]);
}

function findDocsOwnedGrowthTokens(files) {
  const owned = [];
  for (const file of files) {
    const source = readIfExists(file);
    for (const match of source.matchAll(/--(?:ref|sys)-growth-[a-z0-9-]+(?=\s*:)/g)) {
      owned.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        token: match[0],
        status: "fail",
        reason: "Docs must consume package-owned Growth tokens, not redeclare them.",
      });
    }
  }
  return owned;
}

function isGrowthCssDeclaration(property, lineText) {
  if (/^--/.test(property)) return /(?:growth|maturity|analytics|telemetry|deprecated|adoption|stage)/i.test(property);
  return /^(?:color|background|background-color|border-color|font-family)$/.test(property)
    && /(?:growth|maturity|analytics|telemetry|deprecated|adoption|stage|sys-growth)/i.test(lineText);
}

function findGrowthCssDeclarations(file, source, customProperties) {
  const findings = [];
  for (const declaration of collectCssDeclarations(source)) {
    const lineText = declaration.raw;
    const property = declaration.property;
    if (!isGrowthCssDeclaration(property, lineText)) continue;
    const value = lineText.trim();
    if (!value || value.startsWith("/*")) continue;
    const line = declaration.line;
    const isTokenPackage = rel(file) === rel(tokenCssFile);
    if (isTokenPackage && /^\s*--(?:ref|sys)-/.test(lineText)) continue;
    const resolvesToGrowth = valueResolvesToGrowthBoundary(lineText, customProperties);
    const usesLocalAlias = /var\(--[a-z0-9-]+/.test(lineText);
    const stripped = lineText.replace(/var\([^)]*\)/g, "");
    const hasRawGrowthColor = /\b(?:color|background|background-color|border-color)\s*:\s*(?:#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|\b(?:red|blue|green|yellow|orange|black|white)\b)/i.test(stripped);
    const hasRawEventFont = /\bfont-family\s*:\s*["']?(?:ui-monospace|SFMono|Menlo|monospace)/i.test(stripped);
    if (/^--/.test(property) && isGrowthBoundaryToken(property)) {
      findings.push({ file: rel(file), line, value, status: "pass", reason: "Growth styling is centralized behind a Growth, Voice, Energy, or local stage alias." });
      continue;
    }
    if (resolvesToGrowth) {
      findings.push({ file: rel(file), line, value, status: "pass", reason: "Growth styling resolves through Growth, Voice, Energy, or component alias." });
      continue;
    }
    const status = hasRawGrowthColor || hasRawEventFont ? "fail" : usesLocalAlias ? "review" : "review";
    findings.push({
      file: rel(file),
      line,
      value,
      status,
      reason: status === "fail"
        ? "Growth-related styling bypasses Growth, Voice, Energy, or component aliases."
        : "Growth-related styling needs trace to Growth, Voice, Energy, or component alias.",
    });
  }
  return findings;
}

function collectJsonArtifacts(dir) {
  const artifacts = [];
  for (const file of walkFiles(dir, (item) => item.endsWith(".json"))) {
    const parsed = readJson(file);
    const source = readIfExists(file);
    artifacts.push({ file, parsed, source });
  }
  return artifacts;
}

function hasMaturityTarget(value) {
  if (!value || typeof value !== "object") return false;
  if (Object.prototype.hasOwnProperty.call(value, "maturityTarget")) return true;
  return Object.values(value).some((child) => hasMaturityTarget(child));
}

function findMaturityGaps() {
  const files = [
    ...collectJsonArtifacts(componentDir).filter((item) => {
      const parent = path.dirname(item.file);
      return parent === componentDir || path.basename(item.file) === `${path.basename(parent)}.json`;
    }),
    ...collectJsonArtifacts(templateDir).filter((item) => path.dirname(item.file) === templateDir),
  ];
  const gaps = [];
  for (const item of files) {
    if (hasMaturityTarget(item.parsed)) continue;
    gaps.push({
      file: rel(item.file),
      line: 1,
      status: "fail",
      reason: "Shared artifact spec is missing Growth maturityTarget.",
    });
  }
  return gaps;
}

function findTelemetryGaps() {
  const files = [
    ...walkFiles(path.join(root, "apps/docs"), (file) => /\.(?:js|json|md)$/.test(file) && !file.includes(`${path.sep}generated${path.sep}`)),
    ...walkFiles(path.join(root, "packages/components/src"), (file) => file.endsWith(".js")),
    ...walkFiles(path.join(root, "packages/content/content"), (file) => /\.(?:json|md)$/.test(file)),
  ];
  const missingAnalytics = [];
  const analyticsReviews = [];
  for (const file of files) {
    const source = readIfExists(file);
    for (const match of source.matchAll(/data-growth-stage\s*=\s*["'`{]/g)) {
      const window = source.slice(Math.max(0, match.index - 260), match.index + 360);
      if (/data-analytics-event|analyticsEvent|telemetry/i.test(window)) continue;
      missingAnalytics.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        status: "fail",
        reason: "Growth stage metadata appears without nearby analytics/telemetry metadata.",
      });
    }
    for (const match of source.matchAll(/\b(?:analytics|telemetry|data-analytics-event|analyticsEvent)\b/gi)) {
      const window = source.slice(Math.max(0, match.index - 180), match.index + 180);
      const currentLine = source.slice(source.lastIndexOf("\n", match.index) + 1, source.indexOf("\n", match.index) === -1 ? source.length : source.indexOf("\n", match.index));
      if (/"icon"\s*:\s*"analytics"/i.test(currentLine)) continue;
      const hasDecision = /(?:decision|purpose|outcome|adoption|completion|support|quality|audit|critical|permission|risk|recovery|opened|submitted|changed|started|viewed|filtered|selected|synced|eventName|EventSpec|data-growth-stage|KPI|chart|dashboard|finance|preferences|telemetryCount|abandonment|persistence|validation|submitted|submission|refresh|result|feedback|shipped experience|product model|step-level)/i.test(window);
      analyticsReviews.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        value: match[0],
        status: hasDecision ? "pass" : "review",
        reason: hasDecision
          ? "Telemetry reference includes nearby product decision or outcome language."
          : "Telemetry reference needs decision-purpose review.",
      });
    }
  }
  return {
    missingAnalytics,
    reviews: analyticsReviews.filter((item) => item.status === "review").slice(0, 200),
    passCount: analyticsReviews.filter((item) => item.status === "pass").length,
  };
}

function findDeprecationGaps() {
  const files = [
    ...walkFiles(path.join(root, "packages/content/content"), (file) => /\.(?:json|md)$/.test(file)),
    ...walkFiles(path.join(root, "packages/specs/specs/unison-system/artifacts"), (file) => file.endsWith(".json")),
    ...walkFiles(path.join(root, "docs"), (file) => /\.(?:json|md)$/.test(file) && !file.includes(`${path.sep}audits${path.sep}`)),
  ];
  const reviews = [];
  for (const file of files) {
    const source = readIfExists(file);
    for (const match of source.matchAll(/\bdeprecated\b/gi)) {
      const window = source.slice(Math.max(0, match.index - 240), match.index + 360);
      if (/(?:growth|maturity|stage|stages|states|token|tokens|seed|stable|measured)/i.test(window)) continue;
      if (/(?:replacement|replace|migration|cutoff|use .* instead|replaced)/i.test(window)) continue;
      reviews.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        value: match[0],
        status: "review",
        reason: "Deprecated behavior needs replacement path and cutoff/migration rule.",
      });
    }
  }
  return reviews.slice(0, 200);
}

function findTemplateTelemetryCoverage() {
  const parsed = readJson(templateBlueprintFile);
  const templates = Object.entries(parsed?.templates ?? {});
  return templates.map(([id, blueprint]) => ({
    id,
    status: Array.isArray(blueprint.telemetry) && blueprint.telemetry.length ? "pass" : "fail",
    telemetryCount: Array.isArray(blueprint.telemetry) ? blueprint.telemetry.length : 0,
  }));
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const docsCssFiles = docsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const cssFiles = [componentCssFile, ...docsCssFiles].filter((file) => fs.existsSync(file));
  const spec = readJson(growthSpecFile)?.artifacts?.foundations?.growth;
  const matrix = readJson(dependencyMatrixFile);
  const dependencyEdges = (matrix.dependencies ?? []).filter((dependency) => dependency.from === "Growth" || dependency.to === "Growth");
  const tokenDecls = findTokenDeclarations(tokenCss);
  const customProperties = buildCustomPropertyMap([tokenCss, componentCss, ...docsCssFiles.map(readIfExists)]);
  const missingTokens = requiredTokens.filter((token) => !tokenCss.includes(`${token}:`));
  const roleIds = new Set((spec?.roles ?? []).map((role) => role.id));
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const docsOwnedGrowthTokens = findDocsOwnedGrowthTokens(docsCssFiles);
  const growthRefPattern = /Growth|growth|maturity|adoption|telemetry|analytics|deprecated|data-growth-stage|data-analytics|quality signal|learning signal|sys\.growth|--sys-growth/i;
  const tokenUsePattern = /var\(--(?:ref|sys)-growth-[a-z0-9-]+|var\(--component-[a-z0-9-]*(?:growth|stage|analytics|event|telemetry)[a-z0-9-]*|var\(--comp-[a-z0-9-]*(?:growth|stage|analytics|event|telemetry)[a-z0-9-]*/g;
  const primitiveRefs = collectArtifactRefs(primitiveDir, growthRefPattern);
  const componentRefs = collectArtifactRefs(componentDir, growthRefPattern);
  const patternRefs = collectArtifactRefs(patternContractDir, growthRefPattern);
  const patternCopyRefs = collectArtifactRefs(patternCopyDir, growthRefPattern);
  const templateRefs = collectArtifactRefs(templateDir, growthRefPattern);
  const docsCssUse = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), tokenUsePattern), 0);
  const packageCssUse = countMatches(componentCss, tokenUsePattern);
  const cssFindings = cssFiles.flatMap((file) => findGrowthCssDeclarations(file, readIfExists(file), customProperties));
  const cssFailures = cssFindings.filter((finding) => finding.status === "fail");
  const cssReviews = cssFindings.filter((finding) => finding.status === "review");
  const maturityGaps = findMaturityGaps();
  const telemetry = findTelemetryGaps();
  const deprecationReviews = findDeprecationGaps();
  const templateTelemetry = findTemplateTelemetryCoverage();
  const templateTelemetryFailures = templateTelemetry.filter((item) => item.status === "fail");
  const requiredEdges = ["Growth->Energy", "Growth->Voice"];
  const missingEdges = requiredEdges.filter((edge) => {
    const [from, to] = edge.split("->");
    return !dependencyEdges.some((dependency) => dependency.from === from && dependency.to === to);
  });
  const expectedEnergyEvidence = [
    "--sys-growth-stage-seed-color",
    "--sys-growth-stage-stable-color",
    "--sys-growth-stage-measured-color",
    "--sys-growth-stage-deprecated-color",
  ];
  const growthEnergyEdge = dependencyEdges.find((edge) => edge.from === "Growth" && edge.to === "Energy");
  const documentedEnergyEvidence = new Set((growthEnergyEdge?.evidence ?? []).map((item) => item.token));
  const missingEnergyEvidence = expectedEnergyEvidence.filter((token) => !documentedEnergyEvidence.has(token));

  const gaps = [];
  if (missingRoles.length) gaps.push(`Growth spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingTokens.length) gaps.push(`Token package is missing required Growth tokens: ${missingTokens.join(", ")}.`);
  if (docsOwnedGrowthTokens.length) gaps.push("Docs still declare Growth tokens instead of consuming package-owned tokens.");
  if (cssFailures.length) gaps.push("Some CSS growth declarations bypass Growth, Voice, Energy, or component aliases.");
  if (cssReviews.length) gaps.push("Some growth-related CSS declarations need trace review.");
  if (maturityGaps.length) gaps.push("Some shared artifact specs are missing maturityTarget.");
  if (telemetry.missingAnalytics.length) gaps.push("Some growth-stage metadata appears without analytics/telemetry metadata.");
  if (telemetry.reviews.length) gaps.push("Some telemetry references need decision-purpose review.");
  if (deprecationReviews.length) gaps.push("Some deprecation references need replacement/cutoff review.");
  if (templateTelemetryFailures.length) gaps.push("Some template blueprints are missing telemetry.");
  if (missingEdges.length) gaps.push(`Foundation dependency matrix is missing Growth edges: ${missingEdges.join(", ")}.`);
  if (missingEnergyEvidence.length) gaps.push(`Growth -> Energy edge is incomplete for stage evidence: ${missingEnergyEvidence.join(", ")}.`);

  let status = "pass";
  if (
    missingRoles.length ||
    missingTokens.length ||
    docsOwnedGrowthTokens.length ||
    cssFailures.length ||
    maturityGaps.length ||
    telemetry.missingAnalytics.length ||
    templateTelemetryFailures.length ||
    missingEdges.length ||
    missingEnergyEvidence.length
  ) status = "fail";
  else if (cssReviews.length || telemetry.reviews.length || deprecationReviews.length || componentRefs.count < 1 || patternRefs.count < 1 || templateRefs.count < 1) status = "review";

  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    foundation: "Growth",
    status,
    principle: "Growth governs maturity, adoption, telemetry, deprecation, and learning signals. It must make artifact evolution explicit without turning maturity into decorative UI or vanity analytics.",
    tokenOwnership: {
      tokenCss: rel(tokenCssFile),
      declarations: tokenDecls.length,
      requiredTokens,
      missingTokens,
      docsOwnedGrowthTokens,
    },
    specContract: {
      file: rel(growthSpecFile),
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
      evidence: edge.evidence ?? [],
    })),
    cascadeCoverage: {
      primitives: primitiveRefs,
      components: componentRefs,
      patterns: patternRefs,
      patternCopy: patternCopyRefs,
      templates: templateRefs,
      packageCssDirectUses: packageCssUse,
      docsCssDirectUses: docsCssUse,
    },
    growthCssDeclarations: {
      scannedFiles: cssFiles.map(rel),
      totalFindings: cssFindings.length,
      failures: cssFailures,
      reviews: cssReviews,
      passCount: cssFindings.length - cssFailures.length - cssReviews.length,
    },
    maturityCoverage: {
      maturityTargetGaps: maturityGaps,
    },
    telemetryCoverage: {
      missingAnalyticsForGrowthStage: telemetry.missingAnalytics,
      decisionPurposeReviews: telemetry.reviews,
      decisionPurposePassCount: telemetry.passCount,
      templateTelemetry,
    },
    deprecationReviews,
    missingDependencyEdges: missingEdges,
    dependencyEvidenceGaps: {
      growthToEnergy: missingEnergyEvidence,
    },
    gaps,
    nextActions: [
      "Complete Growth -> Energy dependency evidence for every stage color, including measured and deprecated.",
      "Route Growth-related visual stage treatments through Growth, Voice, Energy, or component aliases.",
      "Require growth stage plus analytics/telemetry metadata together for critical shared actions.",
      "Review deprecation references so each one includes replacement path and cutoff or migration rule.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# Growth Cascade Audit");
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
  lines.push(`| Pattern contract refs | ${report.cascadeCoverage.patterns.count} | ${report.cascadeCoverage.patterns.ids.slice(0, 18).join(", ")}${report.cascadeCoverage.patterns.count > 18 ? "..." : ""} |`);
  lines.push(`| Pattern copy refs | ${report.cascadeCoverage.patternCopy.count} | ${report.cascadeCoverage.patternCopy.ids.slice(0, 18).join(", ")}${report.cascadeCoverage.patternCopy.count > 18 ? "..." : ""} |`);
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
  else lines.push("- No fail-level Growth cascade gaps detected.");
  lines.push("");
  lines.push("## Growth CSS Failures");
  lines.push("");
  if (report.growthCssDeclarations.failures.length) {
    lines.push("| File | Line | Value |");
    lines.push("| --- | ---: | --- |");
    for (const finding of report.growthCssDeclarations.failures.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | \`${finding.value.replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No raw Growth CSS bypasses found in scanned CSS.");
  }
  lines.push("");
  lines.push("## Telemetry And Deprecation Reviews");
  lines.push("");
  const reviews = [
    ...report.telemetryCoverage.missingAnalyticsForGrowthStage,
    ...report.telemetryCoverage.decisionPurposeReviews,
    ...report.deprecationReviews,
  ];
  if (reviews.length) {
    lines.push("| File | Line | Value | Reason |");
    lines.push("| --- | ---: | --- | --- |");
    for (const finding of reviews.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | \`${String(finding.value ?? "metadata").replace(/\|/g, "\\|")}\` | ${finding.reason} |`);
    }
  } else {
    lines.push("- No telemetry or deprecation reviews found.");
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
      console.error("Growth cascade audit is stale. Run: node packages/audit/scripts/report-foundation-growth-cascade.js");
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
    cssFailures: report.growthCssDeclarations.failures.length,
    cssTraceReviews: report.growthCssDeclarations.reviews.length,
    maturityTargetGaps: report.maturityCoverage.maturityTargetGaps.length,
    missingAnalyticsForGrowthStage: report.telemetryCoverage.missingAnalyticsForGrowthStage.length,
    telemetryReviews: report.telemetryCoverage.decisionPurposeReviews.length,
    deprecationReviews: report.deprecationReviews.length,
    missingDependencyEdges: report.missingDependencyEdges.length,
    dependencyEvidenceGaps: report.dependencyEvidenceGaps.growthToEnergy.length,
  }, null, 2));
}

main();
