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
const jsonOutput = path.join(outputDir, "foundation-depth-cascade-audit.json");
const markdownOutput = path.join(outputDir, "foundation-depth-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const depthSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/foundations/depth.json");
const primitiveDir = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const dependencyMatrixFile = path.join(root, "docs/audits/foundation-dependency-matrix.json");

const requiredRoles = ["canvas", "raised", "floating", "overlay", "dialog", "toast"];
const requiredTokens = [
  "--ref-depth-shadow-color-rgb",
  "--ref-depth-overlay-light",
  "--ref-depth-overlay-dark",
  "--ref-depth-blur-sm",
  "--ref-depth-blur-md",
  "--ref-depth-blur-lg",
  "--ref-depth-z-base",
  "--ref-depth-z-dropdown",
  "--ref-depth-z-sticky",
  "--ref-depth-z-overlay",
  "--ref-depth-z-dialog",
  "--ref-depth-z-toast",
  "--sys-depth-overlay",
  "--sys-depth-backdrop-blur",
  "--sys-depth-z-dropdown",
  "--sys-depth-z-sticky",
  "--sys-depth-z-overlay",
  "--sys-depth-z-dialog",
  "--sys-depth-z-toast",
  "--sys-depth-blur-topbar",
  "--sys-depth-lift-subtle",
  "--sys-depth-lift-rest",
  "--sys-depth-lift-raised",
  "--sys-depth-lift-overlay",
  "--sys-depth-elevation-0",
  "--sys-depth-elevation-1",
  "--sys-depth-elevation-2",
  "--sys-depth-elevation-3",
  "--sys-depth-elevation-4",
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

function isDepthBoundaryToken(name) {
  return /^--(?:ref|sys)-depth-/.test(name)
    || /^--sys-a11y-overlay-depth$/.test(name)
    || /^--(?:component|comp|pattern)-[a-z0-9-]*(?:depth|shadow|elevation|backdrop|scrim|blur|ring|halo|(?:^|-)z(?:-|$))[a-z0-9-]*/.test(name);
}

function isLocalDepthRecipe(name) {
  return /^--[a-z0-9-]+-[a-z0-9-]*(?:shadow|elevation|backdrop|scrim|blur|ring|halo)[a-z0-9-]*/.test(name);
}

function aliasResolvesToDepthBoundary(name, customProperties, seen = new Set()) {
  if (isDepthBoundaryToken(name) || isLocalDepthRecipe(name)) return true;
  if (seen.has(name)) return false;
  seen.add(name);
  const values = customProperties.get(name) ?? [];
  if (!values.length) return false;
  return values.some((value) => {
    const deps = varNames(value);
    if (!deps.length) return /^(?:none|auto|inherit|initial|unset|transparent)$/.test(value);
    return deps.some((dep) => aliasResolvesToDepthBoundary(dep, customProperties, new Set(seen)));
  });
}

function valueResolvesToDepthBoundary(value, customProperties) {
  const deps = varNames(value);
  if (!deps.length) return false;
  return deps.some((dep) => aliasResolvesToDepthBoundary(dep, customProperties));
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
      pending = {
        line: index + 1,
        property: match[1],
        text: trimmed,
        raw: `${match[1]}: ${match[2]}`,
      };
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
  return [...css.matchAll(/--(?:ref|sys)-depth-[a-z0-9-]+(?=\s*:)/g)].map((match) => match[0]);
}

function findDocsOwnedDepthTokens(files) {
  const owned = [];
  for (const file of files) {
    const source = readIfExists(file);
    for (const match of source.matchAll(/--(?:ref|sys)-depth-[a-z0-9-]+(?=\s*:)/g)) {
      owned.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        token: match[0],
        status: "fail",
        reason: "Docs must consume package-owned Depth tokens, not redeclare them.",
      });
    }
  }
  return owned;
}

function isDepthDeclaration(property, lineText) {
  if (/^transition/.test(property)) return false;
  if (/^--/.test(property)) return /(?:depth|shadow|elevation|backdrop|scrim|blur|ring|halo|(?:^|-)z(?:-|$))/i.test(property);
  return /^(?:box-shadow|text-shadow|z-index|backdrop-filter|filter)$/.test(property)
    || /drop-shadow|blur\(/i.test(lineText);
}

function findDepthDeclarations(file, source, customProperties) {
  const findings = [];
  for (const declaration of collectCssDeclarations(source)) {
    const lineText = declaration.raw;
    const property = declaration.property;
    if (!isDepthDeclaration(property, lineText)) continue;
    const value = lineText.trim();
    if (!value || value.startsWith("/*") || /linear-gradient/.test(lineText)) continue;
    const line = declaration.line;
    const isTokenPackage = rel(file) === rel(tokenCssFile);
    if (isTokenPackage && /^\s*--(?:ref|sys)-/.test(lineText)) continue;
    const resolvesToDepth = valueResolvesToDepthBoundary(lineText, customProperties);
    const usesAllowedDependency = /var\(--(?:sys|ref)-(?:energy|frame|state)-/.test(lineText);
    const usesLocalAlias = /var\(--[a-z0-9-]+/.test(lineText);
    const stripped = lineText.replace(/var\([^)]*\)/g, "");
    const isNoDepth = /\b(?:box-shadow|text-shadow|filter|backdrop-filter)\s*:\s*none\b/.test(stripped)
      || /\bz-index\s*:\s*auto\b/.test(stripped);
    const hasRawZ = /\bz-index\s*:\s*-?\d+\b/.test(stripped);
    const hasRawShadow = /\b(?:box-shadow|text-shadow|filter)\s*:\s*(?!none\b)(?:-?\d|rgba?\(|rgb\(|#[0-9a-f])/i.test(stripped);
    const hasRawBlur = /\b(?:backdrop-filter|filter)\s*:\s*blur\(\s*\d/i.test(stripped);
    const hasRawOverlay = /\brgba?\(|#[0-9a-f]{3,8}\b/i.test(stripped) && /overlay|backdrop|scrim|modal|drawer|dialog/i.test(lineText);

    if (resolvesToDepth) {
      findings.push({ file: rel(file), line, value, status: "pass", reason: "Depth styling resolves through Depth or component depth alias." });
      continue;
    }
    if (/^--/.test(property) && (isDepthBoundaryToken(property) || isLocalDepthRecipe(property))) {
      findings.push({ file: rel(file), line, value, status: "pass", reason: "Depth recipe is centralized behind a component or pattern depth alias." });
      continue;
    }
    if (isNoDepth) {
      findings.push({ file: rel(file), line, value, status: "pass", reason: "Explicit no-depth state." });
      continue;
    }
    if (usesAllowedDependency && !hasRawZ && !hasRawShadow && !hasRawBlur && !hasRawOverlay) {
      findings.push({ file: rel(file), line, value, status: "pass", reason: "Depth-adjacent styling resolves through an allowed dependent foundation." });
      continue;
    }
    const status = hasRawZ || hasRawShadow || hasRawBlur || hasRawOverlay ? "fail" : usesLocalAlias ? "review" : "review";
    findings.push({
      file: rel(file),
      line,
      value,
      status,
      reason: status === "fail"
        ? "Depth styling bypasses Depth with raw z-index, shadow, blur, or overlay values."
        : "Depth styling needs trace to Depth or a component alias.",
    });
  }
  return findings;
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const docsCssFiles = docsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const cssFiles = [componentCssFile, ...docsCssFiles].filter((file) => fs.existsSync(file));
  const cssSources = [tokenCss, componentCss, ...docsCssFiles.map(readIfExists)];
  const customProperties = buildCustomPropertyMap(cssSources);
  const spec = readJson(depthSpecFile)?.artifacts?.foundations?.depth;
  const matrix = readJson(dependencyMatrixFile);
  const dependencyEdges = (matrix.dependencies ?? []).filter((dependency) => dependency.from === "Depth" || dependency.to === "Depth");
  const tokenDecls = findTokenDeclarations(tokenCss);
  const missingTokens = requiredTokens.filter((token) => !tokenCss.includes(`${token}:`));
  const roleIds = new Set((spec?.roles ?? []).map((role) => role.id));
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const docsOwnedDepthTokens = findDocsOwnedDepthTokens(docsCssFiles);
  const depthRefPattern = /Depth|Elevation|Overlay|Dialog|Toast|Popover|Menu|Drawer|z-index|box-shadow|sys\.depth|ref\.depth|--sys-depth|--ref-depth/i;
  const tokenUsePattern = /var\(--(?:ref|sys)-depth-[a-z0-9-]+|var\(--component-[a-z0-9-]*(?:depth|shadow|elevation|overlay|z|blur)[a-z0-9-]*|var\(--comp-[a-z0-9-]*(?:depth|shadow|elevation|overlay|z|blur)[a-z0-9-]*/g;
  const primitiveRefs = collectArtifactRefs(primitiveDir, depthRefPattern);
  const componentRefs = collectArtifactRefs(componentDir, depthRefPattern);
  const patternRefs = collectArtifactRefs(patternDir, depthRefPattern);
  const templateRefs = collectArtifactRefs(templateDir, depthRefPattern);
  const docsCssUse = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), tokenUsePattern), 0);
  const packageCssUse = countMatches(componentCss, tokenUsePattern);
  const depthFindings = cssFiles.flatMap((file) => findDepthDeclarations(file, readIfExists(file), customProperties));
  const depthFailures = depthFindings.filter((finding) => finding.status === "fail");
  const depthReviews = depthFindings.filter((finding) => finding.status === "review");
  const requiredEdges = ["Depth->Energy", "Depth->Frame"];
  const missingEdges = requiredEdges.filter((edge) => {
    const [from, to] = edge.split("->");
    return !dependencyEdges.some((dependency) => dependency.from === from && dependency.to === to);
  });

  const gaps = [];
  if (missingRoles.length) gaps.push(`Depth spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingTokens.length) gaps.push(`Token package is missing required Depth tokens: ${missingTokens.join(", ")}.`);
  if (docsOwnedDepthTokens.length) gaps.push("Docs still declare Depth tokens instead of consuming package-owned tokens.");
  if (depthFailures.length) gaps.push("Some CSS depth declarations bypass Depth with raw z-index, shadow, blur, or overlay values.");
  if (depthReviews.length) gaps.push("Some CSS depth declarations need Depth trace review.");
  if (missingEdges.length) gaps.push(`Foundation dependency matrix is missing Depth edges: ${missingEdges.join(", ")}.`);

  let status = "pass";
  if (missingRoles.length || missingTokens.length || docsOwnedDepthTokens.length || depthFailures.length || missingEdges.length) status = "fail";
  else if (depthReviews.length || patternRefs.count < 1 || templateRefs.count < 1) status = "review";

  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    foundation: "Depth",
    status,
    principle: "Depth must govern surface hierarchy, elevation, overlay, blur, and stacking so UI layers communicate priority instead of decorative shadow.",
    tokenOwnership: {
      tokenCss: rel(tokenCssFile),
      declarations: tokenDecls.length,
      requiredTokens,
      missingTokens,
      docsOwnedDepthTokens,
    },
    specContract: {
      file: rel(depthSpecFile),
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
    depthDeclarations: {
      scannedFiles: cssFiles.map(rel),
      totalFindings: depthFindings.length,
      failures: depthFailures,
      reviews: depthReviews,
      passCount: depthFindings.length - depthFailures.length - depthReviews.length,
    },
    gaps,
    nextActions: [
      "Fix fail-level raw z-index, shadow, blur, and overlay values before changing layered component visuals.",
      "Replace product UI depth literals with sys-depth or component depth aliases.",
      "When a component is audited 1:1, verify layer role, escape/focus ownership, backdrop need, and stacking order from this report before visual parity.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# Depth Cascade Audit");
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
  else lines.push("- No fail-level Depth cascade gaps detected.");
  lines.push("");
  lines.push("## Depth Failures");
  lines.push("");
  if (report.depthDeclarations.failures.length) {
    lines.push("| File | Line | Value |");
    lines.push("| --- | ---: | --- |");
    for (const finding of report.depthDeclarations.failures.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | \`${finding.value.replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No raw Depth bypasses found in scanned CSS.");
  }
  lines.push("");
  lines.push("## Depth Trace Reviews");
  lines.push("");
  if (report.depthDeclarations.reviews.length) {
    lines.push("| File | Line | Value |");
    lines.push("| --- | ---: | --- |");
    for (const finding of report.depthDeclarations.reviews.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | \`${finding.value.replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No Depth trace reviews found.");
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
      console.error("Depth cascade audit is stale. Run: node packages/audit/scripts/report-foundation-depth-cascade.js");
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
    depthFailures: report.depthDeclarations.failures.length,
    depthTraceReviews: report.depthDeclarations.reviews.length,
  }, null, 2));
}

main();
