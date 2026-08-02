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
const jsonOutput = path.join(outputDir, "foundation-frame-cascade-audit.json");
const markdownOutput = path.join(outputDir, "foundation-frame-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const frameSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/foundations/frame.json");
const primitiveDir = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const dependencyMatrixFile = path.join(root, "docs/audits/foundation-dependency-matrix.json");

const requiredRoles = ["space", "grid", "density", "radius", "size", "border"];
const requiredTokens = [
  "--ref-frame-space-1",
  "--ref-frame-space-4",
  "--ref-frame-space-8",
  "--ref-frame-radius-3",
  "--ref-frame-height-control-md",
  "--ref-frame-grid-sm-margin",
  "--ref-frame-grid-md-gutter",
  "--ref-frame-grid-lg-columns",
  "--density-control-height",
  "--density-card-padding",
  "--density-component-gap",
  "--sys-frame-padding-control",
  "--sys-frame-radius-control",
  "--sys-frame-height-control-md",
  "--sys-frame-grid-lg-margin",
  "--sys-frame-border-thin",
];
const geometryProperties = [
  "padding",
  "padding-inline",
  "padding-block",
  "padding-inline-start",
  "padding-inline-end",
  "padding-block-start",
  "padding-block-end",
  "margin",
  "margin-inline",
  "margin-block",
  "gap",
  "row-gap",
  "column-gap",
  "border",
  "border-width",
  "border-radius",
  "border-inline",
  "border-block",
  "inline-size",
  "block-size",
  "min-inline-size",
  "min-block-size",
  "max-inline-size",
  "max-block-size",
  "width",
  "height",
  "inset",
  "inset-inline",
  "inset-block",
  "inset-inline-start",
  "inset-inline-end",
  "inset-block-start",
  "inset-block-end",
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

function isFrameCascadeToken(name) {
  return /^--(?:ref|sys)-frame-/.test(name)
    || /^--density-/.test(name)
    || /^--sys-(?:space|radius)-/.test(name)
    || /^--sys-a11y-touch-target-min$/.test(name)
    || /^--sys-(?:symbol|iconography)-size-/.test(name)
    || /^--(?:comp|component|pattern)-/.test(name);
}

function aliasResolvesToFrame(name, customProperties, seen = new Set()) {
  if (isFrameCascadeToken(name)) return true;
  if (seen.has(name)) return false;
  seen.add(name);
  const values = customProperties.get(name) ?? [];
  if (!values.length) return false;
  return values.some((value) => {
    const deps = varNames(value);
    if (!deps.length) return false;
    return deps.some((dep) => aliasResolvesToFrame(dep, customProperties, new Set(seen)));
  });
}

function valueResolvesToFrame(value, customProperties) {
  const deps = varNames(value);
  if (!deps.length) return false;
  return deps.some((dep) => aliasResolvesToFrame(dep, customProperties));
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

function findFrameTokenDeclarations(css) {
  return [...css.matchAll(/--(?:ref|sys)-frame-[a-z0-9-]+(?=\s*:)/g)].map((match) => match[0]);
}

function findDocsOwnedFrameTokens(files) {
  const owned = [];
  for (const file of files) {
    const source = readIfExists(file);
    for (const match of source.matchAll(/--(?:ref|sys)-frame-[a-z0-9-]+(?=\s*:)/g)) {
      owned.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        token: match[0],
        status: "fail",
        reason: "Docs must consume package-owned Frame tokens, not redeclare them.",
      });
    }
  }
  return owned;
}

function findRuntimeFrameAliases(files) {
  const aliases = [];
  for (const file of files) {
    const source = readIfExists(file);
    for (const match of source.matchAll(/--(?:frame|density)-[a-z0-9-]+(?=\s*:)/g)) {
      aliases.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        token: match[0],
        status: match[0].startsWith("--frame-") ? "review" : "pass",
        reason: match[0].startsWith("--frame-")
          ? "Docs runtime frame alias must stay tied to sys/ref Frame tokens."
          : "Density runtime alias participates in Frame context.",
      });
    }
  }
  return aliases;
}

function findGeometryDeclarations(file, source, customProperties) {
  const findings = [];
  const propertyPattern = geometryProperties.map((property) => property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const declarationPattern = new RegExp(`(?:^|[;{}\\n])\\s*(?<property>${propertyPattern})\\s*:\\s*(?<value>[^;]+);`, "g");
  let match;
  while ((match = declarationPattern.exec(source))) {
    const property = match.groups.property;
    const value = match.groups.value.trim();
    if (value.includes("{") || value.includes("}")) continue;
    const isTokenPackage = rel(file) === rel(tokenCssFile);
    if (isTokenPackage) continue;
    const isResetLiteral = /^(0|auto|none|100%|100dvh|100vh|100vi|100vw|max-content|min-content|fit-content|transparent)$/.test(value);
    const isResetList = value.split(/\s+/).every((part) => /^(?:0|auto|-?\d*\.?\d+%)$/.test(part));
    const isKeywordGeometry = /^(?:inherit|initial|unset|revert)$/i.test(value);
    const isRelativeValue = /^-?\d*\.?\d+%$/.test(value);
    const isDataGeometry = /var\(--(?:progress-value|chart-value|chart-tooltip-[xy])(?:,|\))/.test(value);
    const isResetFallback = /var\(--[a-z0-9-]+,\s*(?:0|auto|none)\s*\)/.test(value);
    const isReadableMeasure = property === "max-inline-size" && /^(?:\d+(?:\.\d+)?ch|min\(\d+(?:\.\d+)?ch,\s*100%\))$/.test(value);
    const isSemanticFrame = /var\(--sys-frame-|var\(--frame-|var\(--density-|var\(--sys-space-|var\(--sys-radius-|var\(--(?:comp|component|pattern)-/.test(value);
    const isResolvedAlias = /var\(--[a-z0-9-]+/.test(value) && valueResolvesToFrame(value, customProperties);
    const isDirectRefFrame = /var\(--ref-frame-/.test(value);
    const isLocalAlias = /var\(--[a-z0-9-]+/.test(value);
    const hasRawLength = /(^|[\s,(])(?:-?\d*\.?\d+)(?:px|rem|em|vw|vh|vi|vb|%)\b/.test(value) && !/var\(/.test(value);
    const hasCalcWithoutFrame = /^calc\(/.test(value) && !/var\(--(?:ref|sys)-frame-|var\(--frame-|var\(--density-|var\(--sys-space-|var\(--sys-radius-|var\(--(?:comp|component|pattern)-/.test(value);
    const hasClampWithoutFrame = /^clamp\(/.test(value) && !/var\(--(?:ref|sys)-frame-|var\(--frame-|var\(--density-|var\(--sys-space-|var\(--sys-radius-|var\(--(?:comp|component|pattern)-/.test(value);
    if (isSemanticFrame || isResolvedAlias || isResetLiteral || isResetList || isKeywordGeometry || isRelativeValue || isDataGeometry || isResetFallback || isReadableMeasure) continue;
    const status = (hasRawLength || hasCalcWithoutFrame || hasClampWithoutFrame) ? "fail" : (isDirectRefFrame || isLocalAlias) ? "review" : "review";
    findings.push({
      file: rel(file),
      line: lineNumber(source, match.index),
      property,
      value,
      status,
      reason: status === "fail"
        ? "Geometry bypasses Frame/Density/component aliases."
        : isDirectRefFrame
          ? "Direct ref-frame use must be justified or elevated to sys/component alias."
          : "Geometry declaration needs Frame trace.",
    });
  }
  return findings;
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const docsCssFiles = docsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const cssFiles = [componentCssFile, ...docsCssFiles].filter((file) => fs.existsSync(file));
  const customProperties = buildCustomPropertyMap([tokenCss, ...cssFiles.map((file) => readIfExists(file))]);
  const spec = readJson(frameSpecFile)?.artifacts?.foundations?.frame;
  const matrix = readJson(dependencyMatrixFile);
  const dependencyEdges = (matrix.dependencies ?? []).filter((dependency) => dependency.from === "Frame" || dependency.to === "Frame");
  const tokenDecls = findFrameTokenDeclarations(tokenCss);
  const missingTokens = requiredTokens.filter((token) => !tokenCss.includes(`${token}:`));
  const roleIds = new Set((spec?.roles ?? []).map((role) => role.id));
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const docsOwnedFrameTokens = findDocsOwnedFrameTokens(docsCssFiles);
  const runtimeAliases = findRuntimeFrameAliases(docsCssFiles);
  const geometryFindings = cssFiles.flatMap((file) => findGeometryDeclarations(file, readIfExists(file), customProperties));
  const geometryFailures = geometryFindings.filter((finding) => finding.status === "fail");
  const geometryReviews = geometryFindings.filter((finding) => finding.status === "review");
  const frameRefPattern = /Frame|Density|sys\.frame|ref\.frame|--sys-frame|--ref-frame|--density-|--comp-[a-z0-9-]+-(?:padding|gap|radius|border|size|height|width|space|frame)/i;
  const tokenUsePattern = /var\(--(?:ref|sys)-frame-[a-z0-9-]+|var\(--density-[a-z0-9-]+|var\(--comp-[a-z0-9-]+-(?:padding|gap|radius|border|size|height|width|space|frame)[a-z0-9-]*/g;
  const primitiveRefs = collectArtifactRefs(primitiveDir, frameRefPattern);
  const componentRefs = collectArtifactRefs(componentDir, frameRefPattern);
  const patternRefs = collectArtifactRefs(patternDir, frameRefPattern);
  const templateRefs = collectArtifactRefs(templateDir, frameRefPattern);
  const docsCssUse = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), tokenUsePattern), 0);
  const packageCssUse = countMatches(componentCss, tokenUsePattern);
  const requiredEdges = ["Frame->Density", "Density->Frame", "Depth->Frame", "State->Frame"];
  const missingEdges = requiredEdges.filter((edge) => {
    const [from, to] = edge.split("->");
    return !dependencyEdges.some((dependency) => dependency.from === from && dependency.to === to);
  });

  const gaps = [];
  if (missingRoles.length) gaps.push(`Frame spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingTokens.length) gaps.push(`Token package is missing required Frame/Density tokens: ${missingTokens.join(", ")}.`);
  if (docsOwnedFrameTokens.length) gaps.push("Docs still declare ref/sys Frame tokens instead of consuming package-owned tokens.");
  if (geometryFailures.length) gaps.push("Some CSS geometry declarations bypass Frame, Density, or component/pattern aliases.");
  if (geometryReviews.length) gaps.push("Some CSS geometry declarations need Frame trace review.");
  if (missingEdges.length) gaps.push(`Foundation dependency matrix is missing Frame edges: ${missingEdges.join(", ")}.`);

  let status = "pass";
  if (missingRoles.length || missingTokens.length || docsOwnedFrameTokens.length || geometryFailures.length || missingEdges.length) status = "fail";
  else if (geometryReviews.length || patternRefs.count < 1 || templateRefs.count < 1) status = "review";

  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    foundation: "Frame",
    status,
    principle: "Frame must govern spacing, grid, density, radius, sizing, borders, and responsive rhythm before any component, pattern, or template solves layout locally.",
    tokenOwnership: {
      tokenCss: rel(tokenCssFile),
      declarations: tokenDecls.length,
      requiredTokens,
      missingTokens,
      docsOwnedFrameTokens,
      runtimeAliases,
    },
    specContract: {
      file: rel(frameSpecFile),
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
    geometryDeclarations: {
      scannedFiles: cssFiles.map(rel),
      totalFindings: geometryFindings.length,
      failures: geometryFailures,
      reviews: geometryReviews,
    },
    gaps,
    nextActions: [
      "Fix fail-level raw geometry before touching the next foundation.",
      "Promote repeated direct ref-frame usage to sys/component/pattern aliases when it is product UI rather than foundation reference.",
      "When a component is audited 1:1, verify demo container width, padding, radius, and density behavior against this report.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# Frame Cascade Audit");
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
  else lines.push("- No fail-level Frame cascade gaps detected.");
  lines.push("");
  lines.push("## Geometry Failures");
  lines.push("");
  if (report.geometryDeclarations.failures.length) {
    lines.push("| File | Line | Property | Value |");
    lines.push("| --- | ---: | --- | --- |");
    for (const finding of report.geometryDeclarations.failures.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | ${finding.property} | \`${finding.value.replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No raw geometry bypasses found in scanned CSS.");
  }
  lines.push("");
  lines.push("## Geometry Trace Reviews");
  lines.push("");
  if (report.geometryDeclarations.reviews.length) {
    lines.push("| File | Line | Property | Value |");
    lines.push("| --- | ---: | --- | --- |");
    for (const finding of report.geometryDeclarations.reviews.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | ${finding.property} | \`${finding.value.replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No untraced geometry declarations found in scanned CSS.");
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
      console.error("Frame cascade audit is stale. Run: node packages/audit/scripts/report-foundation-frame-cascade.js");
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
    geometryFailures: report.geometryDeclarations.failures.length,
    geometryTraceReviews: report.geometryDeclarations.reviews.length,
  }, null, 2));
}

main();
