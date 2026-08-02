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
const jsonOutput = path.join(outputDir, "foundation-voice-cascade-audit.json");
const markdownOutput = path.join(outputDir, "foundation-voice-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const voiceSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/foundations/voice.json");
const primitiveDir = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const dependencyMatrixFile = path.join(root, "docs/audits/foundation-dependency-matrix.json");

const typographyProperties = ["font-family", "font-size", "font-weight", "line-height", "letter-spacing"];
const requiredRoles = ["display", "heading", "numeral", "label", "paragraph", "caption", "code"];
const requiredTokens = [
  "--sys-voice-display-lg-size",
  "--sys-voice-heading-lg-size",
  "--sys-voice-numeral-family",
  "--sys-voice-label-md-size",
  "--sys-voice-paragraph-md-size",
  "--sys-voice-caption-size",
  "--sys-voice-code-size",
  "--sys-voice-family-control",
  "--sys-voice-weight-control",
  "--sys-voice-line-height-control",
];

function walkFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const output = [];
  for (const entry of fs.readdirSync(dir)) {
    const file = path.join(dir, entry);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) {
      output.push(...walkFiles(file, predicate));
    } else if (predicate(file)) {
      output.push(file);
    }
  }
  return output.sort();
}

function rel(file) {
  return path.relative(root, file);
}

function lineNumber(source, index) {
  return source.slice(0, index).split("\n").length;
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function artifactId(file, baseDir) {
  const parts = path.relative(baseDir, file).split(path.sep);
  return parts[0].replace(/\.(?:json|md)$/, "");
}

function readIfExists(file) {
  return fs.existsSync(file) ? read(file) : "";
}

function collectArtifactRefs(dir, pattern) {
  const files = walkFiles(dir, (file) => /\.(?:json|md)$/.test(file));
  const ids = new Set();
  const evidence = [];
  for (const file of files) {
    const source = readIfExists(file);
    if (!pattern.test(source)) continue;
    const id = artifactId(file, dir);
    ids.add(id);
    evidence.push(rel(file));
  }
  return {
    count: ids.size,
    ids: [...ids].sort(),
    sampleFiles: evidence.slice(0, 12),
  };
}

function extractRootBlock(source) {
  const start = source.indexOf(":root");
  if (start < 0) return "";
  const open = source.indexOf("{", start);
  if (open < 0) return "";
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, index);
    }
  }
  return "";
}

function findTokenDeclarations(css) {
  return [...css.matchAll(/--(?:ref|sys)-voice-[a-z0-9-]+(?=\s*:)/g)].map((match) => match[0]);
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
  return [...value.matchAll(/var\(\s*(--[a-z0-9-]+)/g)].map((match) => match[1]);
}

function isVoiceCascadeToken(name) {
  return /^--(?:ref|sys)-voice-/.test(name)
    || /^--(?:ref|sys)-(?:symbol|iconography)-/.test(name)
    || /^--density-/.test(name);
}

function aliasResolvesToVoice(name, customProperties, seen = new Set()) {
  if (isVoiceCascadeToken(name)) return true;
  if (seen.has(name)) return false;
  seen.add(name);
  const values = customProperties.get(name) ?? [];
  if (!values.length) return false;
  return values.some((value) => {
    const deps = varNames(value);
    if (!deps.length) return false;
    return deps.every((dep) => aliasResolvesToVoice(dep, customProperties, new Set(seen)));
  });
}

function valueResolvesToVoice(value, customProperties) {
  const deps = varNames(value);
  if (!deps.length) return false;
  return deps.every((dep) => aliasResolvesToVoice(dep, customProperties));
}

function findTypographyDeclarations(file, source, customProperties) {
  const findings = [];
  const declarationPattern = /(?<property>font-family|font-size|font-weight|line-height|letter-spacing)\s*:\s*(?<value>[^;]+);/g;
  let match;
  while ((match = declarationPattern.exec(source))) {
    const property = match.groups.property;
    const value = match.groups.value.trim();
    const isFontFaceFile = rel(file) === "apps/docs/styles/00-foundations-01.css";
    const isAllowedLiteral = ["inherit", "normal", "0", "0em", "1"].includes(value);
    const isVoiceTokenized = /var\(--(?:ref|sys)-voice-/.test(value);
    const isKnownCascadeAlias = /var\(--(?:comp|component|density|pattern)-/.test(value);
    const isLocalAlias = /var\(--[a-z0-9-]+/.test(value);
    const isResolvedLocalAlias = isLocalAlias && valueResolvesToVoice(value, customProperties);
    const isResponsiveTokenClamp = /^clamp\([^)]*var\(--(?:ref|sys|density)-/.test(value);
    const isSymbolFamily = value.includes("--sys-symbol-family") || value.includes("--sys-iconography-family");
    const isAllowed = isFontFaceFile || isAllowedLiteral || isVoiceTokenized || isKnownCascadeAlias || isResolvedLocalAlias || isResponsiveTokenClamp || isSymbolFamily;
    const status = isAllowed ? "pass" : isLocalAlias ? "review" : "fail";
    findings.push({
      file: rel(file),
      line: lineNumber(source, match.index),
      property,
      value,
      status,
      reason: isAllowed
        ? "Typography resolves through Voice, Density, component/pattern alias, Symbol/Iconography, or font-face ownership."
        : isLocalAlias
          ? "Typography uses a local alias; the alias must be traced to Voice, Density, Symbol, or Iconography."
        : "Raw typography value bypasses the Voice cascade.",
    });
  }
  return findings;
}

function findAliasBridgeGaps(componentCss) {
  const rootBlock = extractRootBlock(componentCss);
  const requiredMappings = [
    ["--component-font-size-caption", "var(--sys-voice-caption-size)"],
    ["--component-font-size-label", "var(--sys-voice-label-md-size)"],
    ["--component-font-size-body", "var(--sys-voice-paragraph-sm-size)"],
    ["--component-font-size-title-sm", "var(--sys-voice-heading-sm-size)"],
    ["--component-font-size-title-md", "var(--sys-voice-heading-md-size)"],
    ["--component-font-size-title-lg", "var(--sys-voice-heading-lg-size)"],
    ["--component-font-family-mono", "var(--sys-voice-family-mono)"],
  ];
  return requiredMappings
    .filter(([alias, value]) => !rootBlock.includes(`${alias}: ${value}`))
    .map(([alias, value]) => ({ alias, expected: value }));
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const voiceSpec = readJson(voiceSpecFile)?.artifacts?.foundations?.voice;
  const dependencyMatrix = readJson(dependencyMatrixFile);
  const dependencyEdges = (dependencyMatrix.dependencies ?? []).filter((dependency) => dependency.from === "Voice" || dependency.to === "Voice");
  const docsCssFiles = docsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const cssFiles = [componentCssFile, ...docsCssFiles].filter((file) => fs.existsSync(file));
  const customProperties = buildCustomPropertyMap([tokenCss, ...cssFiles.map((file) => readIfExists(file))]);
  const typographyFindings = cssFiles.flatMap((file) => findTypographyDeclarations(file, readIfExists(file), customProperties));
  const failingTypography = typographyFindings.filter((finding) => finding.status === "fail");
  const reviewTypography = typographyFindings.filter((finding) => finding.status === "review");
  const voiceDecls = findTokenDeclarations(tokenCss);
  const docsOwnedVoiceTokens = docsCssFiles.flatMap((file) => {
    const source = readIfExists(file);
    return [...source.matchAll(/--(?:ref|sys)-voice-[a-z0-9-]+(?=\s*:)/g)].map((match) => ({
      file: rel(file),
      line: lineNumber(source, match.index),
      token: match[0],
    }));
  });
  const voiceRefPattern = /Voice|sys\.voice|ref\.voice|--sys-voice|--ref-voice|--component-font-size|--comp-[a-z0-9-]+-(?:label|title|caption|body|value|font|text|copy)/i;
  const tokenUsePattern = /var\(--(?:ref|sys)-voice-[a-z0-9-]+|var\(--component-font-size-[a-z0-9-]+|var\(--comp-[a-z0-9-]+-(?:label|title|caption|body|value|font|text|copy)[a-z0-9-]*/g;
  const docsCssUse = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), tokenUsePattern), 0);
  const packageCssUse = countMatches(componentCss, tokenUsePattern);
  const primitiveRefs = collectArtifactRefs(primitiveDir, voiceRefPattern);
  const componentRefs = collectArtifactRefs(componentDir, voiceRefPattern);
  const patternRefs = collectArtifactRefs(patternDir, voiceRefPattern);
  const templateRefs = collectArtifactRefs(templateDir, voiceRefPattern);
  const roleIds = new Set((voiceSpec?.roles ?? []).map((role) => role.id));
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const missingTokens = requiredTokens.filter((token) => !tokenCss.includes(`${token}:`));
  const aliasBridgeGaps = findAliasBridgeGaps(componentCss);
  const tokenDependencies = Array.isArray(voiceSpec?.tokenDependencies) ? voiceSpec.tokenDependencies : [];
  const primitiveDependencies = Array.isArray(voiceSpec?.primitiveDependencies) ? voiceSpec.primitiveDependencies : [];
  const componentDependencies = Array.isArray(voiceSpec?.componentDependencies) ? voiceSpec.componentDependencies : [];

  const gaps = [];
  if (missingRoles.length) gaps.push(`Voice spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingTokens.length) gaps.push(`Token package is missing required Voice tokens: ${missingTokens.join(", ")}.`);
  if (docsOwnedVoiceTokens.length) gaps.push("Docs still declare Voice tokens instead of consuming package-owned tokens.");
  if (aliasBridgeGaps.length) gaps.push("Component alias bridge does not expose all required Voice roles.");
  if (failingTypography.length) gaps.push("Some CSS typography declarations bypass Voice/Density/component aliases.");
  if (reviewTypography.length) gaps.push("Some CSS typography declarations use local aliases that still need cascade tracing.");
  if (!dependencyEdges.some((edge) => edge.from === "Density" && edge.to === "Voice")) gaps.push("Density->Voice dependency is missing from the foundation matrix.");
  if (!dependencyEdges.some((edge) => edge.from === "Tone" && edge.to === "Voice")) gaps.push("Tone->Voice dependency is missing from the foundation matrix.");

  let status = "pass";
  if (missingRoles.length || missingTokens.length || docsOwnedVoiceTokens.length || aliasBridgeGaps.length || failingTypography.length) status = "fail";
  else if (reviewTypography.length || patternRefs.count < 1 || templateRefs.count < 1) status = "review";

  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    foundation: "Voice",
    status,
    principle: "Voice must govern typographic role, product language, numerals, labels, helper copy, and repair copy across the full cascade.",
    tokenOwnership: {
      tokenCss: rel(tokenCssFile),
      declarations: voiceDecls.length,
      requiredTokens,
      missingTokens,
      docsOwnedVoiceTokens,
    },
    specContract: {
      file: rel(voiceSpecFile),
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
    componentAliasBridge: {
      file: rel(componentCssFile),
      gaps: aliasBridgeGaps,
    },
    typographyDeclarations: {
      scannedFiles: cssFiles.map(rel),
      total: typographyFindings.length,
      failures: failingTypography,
      reviews: reviewTypography,
      passCount: typographyFindings.length - failingTypography.length - reviewTypography.length,
    },
    gaps,
    nextActions: [
      "Fix any fail-level Voice ownership or alias-bridge gap before touching the next foundation.",
      "Use this report as the Voice row in the all-foundations cascade audit.",
      "When a component is audited 1:1, verify rendered typography roles against this cascade, not only against local docs copy.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# Voice Cascade Audit");
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
  lines.push(`| Package CSS direct uses | ${report.cascadeCoverage.packageCssDirectUses} | ${report.componentAliasBridge.file} |`);
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
    lines.push("- No fail-level Voice cascade gaps detected.");
  }
  lines.push("");
  lines.push("## Typography Failures");
  lines.push("");
  if (report.typographyDeclarations.failures.length) {
    lines.push("| File | Line | Property | Value |");
    lines.push("| --- | ---: | --- | --- |");
    for (const finding of report.typographyDeclarations.failures.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | ${finding.property} | \`${finding.value.replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No raw typography bypasses found in scanned CSS.");
  }
  lines.push("");
  lines.push("## Typography Alias Reviews");
  lines.push("");
  if (report.typographyDeclarations.reviews.length) {
    lines.push("| File | Line | Property | Value |");
    lines.push("| --- | ---: | --- | --- |");
    for (const finding of report.typographyDeclarations.reviews.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | ${finding.property} | \`${finding.value.replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No untraced local typography aliases found in scanned CSS.");
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
      console.error("Voice cascade audit is stale. Run: node packages/audit/scripts/report-foundation-voice-cascade.js");
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
    typographyFailures: report.typographyDeclarations.failures.length,
    typographyReviews: report.typographyDeclarations.reviews.length,
  }, null, 2));
}

main();
