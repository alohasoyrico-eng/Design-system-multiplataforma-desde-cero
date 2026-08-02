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
const jsonOutput = path.join(outputDir, "foundation-momentum-cascade-audit.json");
const markdownOutput = path.join(outputDir, "foundation-momentum-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const momentumSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/foundations/momentum.json");
const primitiveDir = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const dependencyMatrixFile = path.join(root, "docs/audits/foundation-dependency-matrix.json");

const requiredRoles = ["instant", "fast", "default", "slow", "continuous", "reduced"];
const requiredTokens = [
  "--ref-momentum-duration-instant",
  "--ref-momentum-duration-fast",
  "--ref-momentum-duration-normal",
  "--ref-momentum-duration-slow",
  "--ref-momentum-duration-cycle",
  "--ref-momentum-easing-touch",
  "--ref-momentum-easing-enter",
  "--ref-momentum-easing-move",
  "--ref-momentum-easing-exit",
  "--sys-momentum-duration-fast",
  "--sys-momentum-duration-default",
  "--sys-momentum-duration-slow",
  "--sys-momentum-duration-critical",
  "--sys-momentum-easing-touch",
  "--sys-momentum-easing-enter",
  "--sys-momentum-easing-move",
  "--sys-momentum-easing-exit",
  "--sys-momentum-transition-fast",
  "--sys-momentum-transition-default",
  "--sys-momentum-transition-slow",
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

function isMomentumBoundaryToken(name) {
  return /^--(?:ref|sys)-momentum-/.test(name)
    || /^--sys-state-loading-spin$/.test(name)
    || /^--sys-a11y-motion-duration$/.test(name)
    || /^--ref-a11y-motion-reduced-duration$/.test(name)
    || /^--(?:component|comp)-/.test(name);
}

function aliasResolvesToMomentumBoundary(name, customProperties, seen = new Set()) {
  if (isMomentumBoundaryToken(name)) return true;
  if (seen.has(name)) return false;
  seen.add(name);
  const values = customProperties.get(name) ?? [];
  if (!values.length) return false;
  return values.some((value) => {
    const deps = varNames(value);
    if (!deps.length) {
      return /^(?:none|auto|inherit|initial|unset|normal|paused|running)$/.test(value)
        || /^-?\d*\.?\d+(?:%|px|rem|em|deg)?$/.test(value);
    }
    return deps.some((dep) => aliasResolvesToMomentumBoundary(dep, customProperties, new Set(seen)));
  });
}

function valueResolvesToMomentumBoundary(value, customProperties) {
  const deps = varNames(value);
  if (!deps.length) return false;
  return deps.some((dep) => aliasResolvesToMomentumBoundary(dep, customProperties));
}

function collectCssDeclarations(source) {
  const declarations = [];
  const lines = source.split("\n");
  let pending = null;
  lines.forEach((lineText, index) => {
    const trimmed = lineText.trim();
    if (!pending) {
      const match = trimmed.match(/^([a-z-]+)\s*:\s*(.*)$/i);
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

function findTokenDeclarations(css) {
  return [...css.matchAll(/--(?:ref|sys)-momentum-[a-z0-9-]+(?=\s*:)/g)].map((match) => match[0]);
}

function findDocsOwnedMomentumTokens(files) {
  const owned = [];
  for (const file of files) {
    const source = readIfExists(file);
    for (const match of source.matchAll(/--(?:ref|sys)-momentum-[a-z0-9-]+(?=\s*:)/g)) {
      owned.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        token: match[0],
        status: "fail",
        reason: "Docs must consume package-owned Momentum tokens, not redeclare them.",
      });
    }
  }
  return owned;
}

function isTokenDeclaration(line) {
  return /^\s*--(?:ref|sys)-/.test(line);
}

function findMotionDeclarations(file, source, customProperties) {
  const findings = [];
  for (const declaration of collectCssDeclarations(source)) {
    const lineText = declaration.raw;
    const property = declaration.property;
    if (/linear-gradient/.test(lineText) || /text-transform/.test(lineText) || /transform-origin/.test(lineText)) continue;
    const isMotion = /^(?:transition|transition-[a-z-]+|animation|animation-[a-z-]+|transform|will-change)$/.test(property)
      || /(?:duration|easing|ease)/.test(property);
    if (!isMotion) continue;
    const line = declaration.line;
    const value = declaration.text.replace(/\s+/g, " ");
    const isTokenPackage = rel(file) === rel(tokenCssFile);
    if (isTokenPackage && isTokenDeclaration(lineText)) continue;
    const resolvesToMomentum = valueResolvesToMomentumBoundary(lineText, customProperties);
    const usesLocalAlias = /var\(--[a-z0-9-]+/.test(lineText);
    const hasRawDuration = /\b\d+(?:\.\d+)?m?s\b/.test(lineText.replace(/var\([^)]*\)/g, ""));
    const hasRawEasing = /\bcubic-bezier\(|\bease(?:-in|-out|-in-out)?\b|\blinear\b/.test(lineText.replace(/var\([^)]*\)/g, ""));
    const isNonTimingMotionControl = /^(?:will-change|animation-play-state|animation-fill-mode|animation-name|animation-iteration-count|animation-direction)$/.test(property)
      || /^(?:animation|transform)\s*:\s*none\b/.test(lineText);
    const hasRawTransform = /^transform\s*:\s*(?:translate|scale|rotate|none)/.test(lineText) && !/var\(/.test(lineText);
    const isLayoutTransform = /^transform\s*:\s*translate(?:X|Y)?\([^)]*(?:-50%|0|var\(--)/.test(lineText);
    if (resolvesToMomentum) {
      findings.push({ file: rel(file), line, value, status: "pass", reason: "Motion resolves through Momentum, Accessibility motion, State loading, or component alias." });
      continue;
    }
    if (isNonTimingMotionControl || (property === "transform" && (hasRawTransform || isLayoutTransform))) {
      findings.push({ file: rel(file), line, value, status: "pass", reason: "Motion endpoint or playback control is governed by surrounding Momentum timing/easing." });
      continue;
    }
    const status = (hasRawDuration || hasRawEasing) ? "fail" : (hasRawTransform || usesLocalAlias) ? "review" : "review";
    findings.push({
      file: rel(file),
      line,
      value,
      status,
      reason: status === "fail"
        ? "Motion bypasses Momentum with raw timing or easing."
        : hasRawTransform
          ? "Transform endpoint needs Momentum or component trace."
          : "Motion declaration needs Momentum trace.",
    });
  }
  return findings;
}

function findKeyframes(file, source) {
  return [...source.matchAll(/@keyframes\s+([a-z0-9-]+)/gi)].map((match) => ({
    file: rel(file),
    line: lineNumber(source, match.index),
    name: match[1],
  }));
}

function fileHasReducedMotion(file, source, globalReducedMotion) {
  return /prefers-reduced-motion\s*:\s*reduce/.test(source) || globalReducedMotion;
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const docsCssFiles = docsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const cssFiles = [componentCssFile, ...docsCssFiles].filter((file) => fs.existsSync(file));
  const cssSources = [tokenCss, componentCss, ...docsCssFiles.map(readIfExists)];
  const customProperties = buildCustomPropertyMap(cssSources);
  const spec = readJson(momentumSpecFile)?.artifacts?.foundations?.momentum;
  const matrix = readJson(dependencyMatrixFile);
  const dependencyEdges = (matrix.dependencies ?? []).filter((dependency) => dependency.from === "Momentum" || dependency.to === "Momentum");
  const tokenDecls = findTokenDeclarations(tokenCss);
  const missingTokens = requiredTokens.filter((token) => !tokenCss.includes(`${token}:`));
  const roleIds = new Set((spec?.roles ?? []).map((role) => role.id));
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const docsOwnedMomentumTokens = findDocsOwnedMomentumTokens(docsCssFiles);
  const globalReducedMotion = cssFiles.some((file) => /prefers-reduced-motion\s*:\s*reduce/.test(readIfExists(file)));
  const motionFindings = cssFiles.flatMap((file) => findMotionDeclarations(file, readIfExists(file), customProperties));
  const motionFailures = motionFindings.filter((finding) => finding.status === "fail");
  const motionReviews = motionFindings.filter((finding) => finding.status === "review");
  const keyframes = cssFiles.flatMap((file) => findKeyframes(file, readIfExists(file)));
  const animatedFiles = cssFiles.filter((file) => /animation\s*:|@keyframes/.test(readIfExists(file)));
  const reducedMotionGaps = animatedFiles
    .filter((file) => !fileHasReducedMotion(file, readIfExists(file), globalReducedMotion))
    .map(rel);
  const momentumRefPattern = /Momentum|Motion|Duration|Loading|sys\.momentum|ref\.momentum|--sys-momentum|--ref-momentum|prefers-reduced-motion|transition|animation/i;
  const tokenUsePattern = /var\(--(?:ref|sys)-momentum-[a-z0-9-]+|var\(--component-(?:duration|ease|scale|transition)[a-z0-9-]*|var\(--comp-[a-z0-9-]+-(?:duration|ease|motion|transition|scale|transform)[a-z0-9-]*/g;
  const primitiveRefs = collectArtifactRefs(primitiveDir, momentumRefPattern);
  const componentRefs = collectArtifactRefs(componentDir, momentumRefPattern);
  const patternRefs = collectArtifactRefs(patternDir, momentumRefPattern);
  const templateRefs = collectArtifactRefs(templateDir, momentumRefPattern);
  const docsCssUse = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), tokenUsePattern), 0);
  const packageCssUse = countMatches(componentCss, tokenUsePattern);
  const requiredEdges = ["Accessibility->Momentum"];
  const missingEdges = requiredEdges.filter((edge) => {
    const [from, to] = edge.split("->");
    return !dependencyEdges.some((dependency) => dependency.from === from && dependency.to === to);
  });

  const gaps = [];
  if (missingRoles.length) gaps.push(`Momentum spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingTokens.length) gaps.push(`Token package is missing required Momentum tokens: ${missingTokens.join(", ")}.`);
  if (docsOwnedMomentumTokens.length) gaps.push("Docs still declare Momentum tokens instead of consuming package-owned tokens.");
  if (motionFailures.length) gaps.push("Some CSS motion declarations bypass Momentum with raw timing, easing, or transforms.");
  if (motionReviews.length) gaps.push("Some CSS motion declarations need Momentum trace review.");
  if (reducedMotionGaps.length) gaps.push("Some animated CSS files lack a reduced-motion path.");
  if (missingEdges.length) gaps.push(`Foundation dependency matrix is missing Momentum edges: ${missingEdges.join(", ")}.`);

  let status = "pass";
  if (missingRoles.length || missingTokens.length || docsOwnedMomentumTokens.length || motionFailures.length || reducedMotionGaps.length || missingEdges.length) status = "fail";
  else if (motionReviews.length || patternRefs.count < 1 || templateRefs.count < 1) status = "review";

  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    foundation: "Momentum",
    status,
    principle: "Momentum must govern timing, easing, transforms, loops, enter/exit, and reduced-motion behavior so movement communicates cause instead of decoration.",
    tokenOwnership: {
      tokenCss: rel(tokenCssFile),
      declarations: tokenDecls.length,
      requiredTokens,
      missingTokens,
      docsOwnedMomentumTokens,
    },
    specContract: {
      file: rel(momentumSpecFile),
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
    motionDeclarations: {
      scannedFiles: cssFiles.map(rel),
      totalFindings: motionFindings.length,
      failures: motionFailures,
      reviews: motionReviews,
      passCount: motionFindings.length - motionFailures.length - motionReviews.length,
    },
    animationCoverage: {
      keyframes,
      animatedFiles: animatedFiles.map(rel),
      globalReducedMotion,
      reducedMotionGaps,
    },
    gaps,
    nextActions: [
      "Fix fail-level raw duration/easing/transform and reduced-motion gaps before touching the next foundation.",
      "Replace component duration/ease literals with sys-momentum aliases where they are product UI behavior.",
      "When a component is audited 1:1, verify enter, exit, loop continuity, reduced motion, and user-triggered state timing against this report.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# Momentum Cascade Audit");
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
  lines.push("## Animation Coverage");
  lines.push("");
  lines.push(`- Keyframes: ${report.animationCoverage.keyframes.length}`);
  lines.push(`- Animated files: ${report.animationCoverage.animatedFiles.length}`);
  lines.push(`- Global reduced-motion path: ${report.animationCoverage.globalReducedMotion ? "yes" : "no"}`);
  lines.push(`- Reduced-motion gaps: ${report.animationCoverage.reducedMotionGaps.length}`);
  lines.push("");
  lines.push("## Gaps");
  lines.push("");
  if (report.gaps.length) for (const gap of report.gaps) lines.push(`- ${gap}`);
  else lines.push("- No fail-level Momentum cascade gaps detected.");
  lines.push("");
  lines.push("## Motion Failures");
  lines.push("");
  if (report.motionDeclarations.failures.length) {
    lines.push("| File | Line | Value |");
    lines.push("| --- | ---: | --- |");
    for (const finding of report.motionDeclarations.failures.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | \`${finding.value.replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No raw motion bypasses found in scanned CSS.");
  }
  lines.push("");
  lines.push("## Motion Trace Reviews");
  lines.push("");
  if (report.motionDeclarations.reviews.length) {
    lines.push("| File | Line | Value |");
    lines.push("| --- | ---: | --- |");
    for (const finding of report.motionDeclarations.reviews.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | \`${finding.value.replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No untraced motion declarations found in scanned CSS.");
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
      console.error("Momentum cascade audit is stale. Run: node packages/audit/scripts/report-foundation-momentum-cascade.js");
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
    motionFailures: report.motionDeclarations.failures.length,
    motionTraceReviews: report.motionDeclarations.reviews.length,
    reducedMotionGaps: report.animationCoverage.reducedMotionGaps.length,
  }, null, 2));
}

main();
