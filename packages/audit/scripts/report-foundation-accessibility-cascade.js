#!/usr/bin/env node

const {
  componentCopyFile,
  docsAppDir,
  docsStyleModuleFiles,
  fs,
  goldComponents,
  path,
  read,
  readJson,
  readSpec,
  resolveBoundaryPath,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");

const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "foundation-accessibility-cascade-audit.json");
const markdownOutput = path.join(outputDir, "foundation-accessibility-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const accessibilitySpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/foundations/accessibility.json");
const primitiveDir = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const dependencyMatrixFile = path.join(root, "docs/audits/foundation-dependency-matrix.json");

const requiredRoles = ["name", "role", "state", "focus", "touch", "contrast", "recovery"];
const requiredTokens = [
  "--ref-a11y-touch-target-min",
  "--ref-a11y-contrast-aa",
  "--ref-a11y-contrast-large",
  "--ref-a11y-motion-reduced-duration",
  "--sys-a11y-focus-ring",
  "--sys-a11y-focus-offset",
  "--sys-a11y-touch-target-min",
  "--sys-a11y-contrast-aa",
  "--sys-a11y-motion-duration",
];

const semanticRequirements = {
  button: ["aria-label", "disabled"],
  select: ["aria-expanded", "aria-controls", "role=\"listbox\"", "role=\"option\""],
  checkbox: ["aria-checked"],
  switch: ["role=\"switch\"", "aria-checked"],
  "radio-button": ["type=\"radio\""],
  "icon-button": ["aria-label", "aria-pressed"],
  chip: [["data-chip-remove", "dataset.chipRemove"], "aria-label"],
  tabs: [["role=\"tablist\"", "setAttribute(\"role\", \"tablist\")"], ["role=\"tab\"", "setAttribute(\"role\", \"tab\")"], "aria-selected"],
  tooltip: [["role=\"tooltip\"", "setAttribute(\"role\", \"tooltip\")"], "aria-describedby"],
  toast: [["role=\"status\"", "setAttribute(\"role\", role)"], "role === \"alert\""],
  dialog: [["role=\"dialog\"", "setAttribute(\"role\", \"dialog\")"], ["aria-modal=\"true\"", "setAttribute(\"aria-modal\", \"true\")"], "aria-labelledby"],
  menu: [["aria-haspopup=\"menu\"", "setAttribute(\"aria-haspopup\", \"menu\")"], ["role=\"menu\"", "setAttribute(\"role\", \"menu\")"], ["role=\"menuitem\"", "setAttribute(\"role\", \"menuitem\")"]],
  drawer: [["role=\"dialog\"", "setAttribute(\"role\", \"dialog\")"], ["aria-modal=\"true\"", "setAttribute(\"aria-modal\", \"true\")"], "aria-labelledby"],
  accordion: ["aria-expanded", "aria-controls"],
  table: [["<table", "createElement(\"table\")"], ["scope=\"col\"", ".scope = \"col\""]],
  slider: [["type=\"range\"", ".type = \"range\""], "aria-label"],
  stepper: [["aria-current=\"step\"", "setAttribute(\"aria-current\", \"step\")"]],
};

const nonFocusableByDefault = new Set([
  "avatar",
  "badge",
  "empty-state",
  "inline-validation",
  "progress-indicator",
  "skeleton",
  "stepper",
]);

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

function isAccessibilityBoundaryToken(name) {
  return /^--(?:ref|sys)-a11y-/.test(name)
    || /^--sys-focus-ring(?:-offset)?$/.test(name)
    || /^--(?:ref|sys)-(?:state|momentum|energy|frame|voice|iconography|depth)-/.test(name)
    || /^--(?:component|comp|pattern)-/.test(name);
}

function aliasResolvesToAccessibilityBoundary(name, customProperties, seen = new Set()) {
  if (isAccessibilityBoundaryToken(name)) return true;
  if (seen.has(name)) return false;
  seen.add(name);
  const values = customProperties.get(name) ?? [];
  if (!values.length) return false;
  return values.some((value) => {
    const deps = varNames(value);
    if (!deps.length) return /^(?:none|auto|inherit|initial|unset|transparent|0)$/.test(value)
      || /^-?\d*\.?\d+(?:%|px|rem|em|deg|ms|s)?$/.test(value);
    return deps.some((dep) => aliasResolvesToAccessibilityBoundary(dep, customProperties, new Set(seen)));
  });
}

function valueResolvesToAccessibilityBoundary(value, customProperties) {
  const deps = varNames(value);
  if (!deps.length) return false;
  return deps.some((dep) => aliasResolvesToAccessibilityBoundary(dep, customProperties));
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

function focusBlocksUseBoxShadow(css, component) {
  const componentClass = `.${component}`;
  const focusBlocks = [...css.matchAll(/(?<selector>[^{}]*focus(?:-visible|-within)?[^{}]*)\{(?<body>[^{}]*)\}/gi)]
    .filter((match) => match.groups.selector.includes(componentClass)
      && /:(?:focus-visible|focus-within|focus)\b/.test(match.groups.selector));
  if (focusBlocks.some((match) => /outline\s*:/.test(match.groups.body))) return false;
  return focusBlocks
    .some((match) => match.groups.selector.includes(componentClass)
      && /:(?:focus-visible|focus-within|focus)\b/.test(match.groups.selector)
      && /box-shadow\s*:/.test(match.groups.body)
      && !/outline\s*:/.test(match.groups.body)
      && !/box-shadow\s*:\s*none\b/.test(match.groups.body));
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
  return [...css.matchAll(/--(?:ref|sys)-a11y-[a-z0-9-]+(?=\s*:)/g)].map((match) => match[0]);
}

function findDocsOwnedAccessibilityTokens(files) {
  const owned = [];
  for (const file of files) {
    const source = readIfExists(file);
    for (const match of source.matchAll(/--(?:ref|sys)-a11y-[a-z0-9-]+(?=\s*:)/g)) {
      owned.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        token: match[0],
        status: "fail",
        reason: "Docs must consume package-owned Accessibility tokens, not redeclare them.",
      });
    }
  }
  return owned;
}

function sourceFor(component) {
  const componentsDir = path.join(root, "packages/components/src/components");
  const componentModuleFiles = fs.existsSync(componentsDir)
    ? fs.readdirSync(componentsDir)
      .filter((file) => file.endsWith(".js"))
      .map((file) => path.join(componentsDir, file))
    : [];
  const files = [
    path.join(docsAppDir, `gold-${component}-docs.js`),
    path.join(docsAppDir, "gold-simple-component-docs.js"),
    path.join(docsAppDir, "gold-component-core.js"),
    path.join(docsAppDir, "component-demo.js"),
    path.join(root, "packages/components/src/registry.js"),
    ...componentModuleFiles,
  ];
  return files.filter((file) => fs.existsSync(file)).map((file) => readIfExists(file)).join("\n");
}

function checkComponentAccessibility() {
  const copy = readJson(componentCopyFile)?.components ?? {};
  const spec = readSpec()?.artifacts?.components ?? {};
  const findings = [];

  for (const component of goldComponents) {
    const componentCopy = copy[component];
    const componentSpec = spec[component];
    if (!componentCopy || !componentSpec) continue;

    if (!componentCopy.accessibility?.items?.length) {
      findings.push({ component, file: rel(componentCopyFile), status: "fail", reason: "Component copy needs explicit accessibility guidance." });
    }
    const coverage = componentSpec.foundations?.Accessibility;
    if (!coverage || coverage.status !== "covered") {
      findings.push({ component, file: "packages/specs/specs/unison.system.json", status: "fail", reason: "Component spec must mark Accessibility as covered." });
    }

    const source = sourceFor(component);
    for (const required of semanticRequirements[component] ?? []) {
      const alternatives = Array.isArray(required) ? required : [required];
      if (!alternatives.some((item) => source.includes(item))) {
        findings.push({
          component,
          file: path.relative(root, path.join(docsAppDir, `gold-${component}-docs.js`)),
          status: "fail",
          reason: `Rendered demo source must include accessibility semantic: ${alternatives[0]}.`,
        });
      }
    }
  }
  return findings;
}

function checkFocusContracts() {
  const findings = [];
  const componentStyleFiles = docsStyleModuleFiles.filter((item) => /\/(?:04|05)[a-z0-9-]*\.css$/.test(item));
  const packageCss = readIfExists(componentCssFile);
  for (const component of goldComponents) {
    if (nonFocusableByDefault.has(component)) continue;
    const files = componentStyleFiles.filter((file) => path.basename(file).includes(component));
    const packageOwnsFocus = packageCss.includes(`.${component}`);
    if (!files.length && !packageOwnsFocus) continue;
    const css = `${files.map((file) => readIfExists(file)).join("\n")}\n${packageOwnsFocus ? packageCss : ""}`;
    const source = sourceFor(component);
    const hasInteractiveSignal = /<(?:button|input|select|textarea|a)\b|tabindex="0"|role="(?:button|tab|menuitem|switch|checkbox|radio)"/.test(source);
    if (hasInteractiveSignal && !/:focus-visible|:focus-within|\[data-state="focus"\]/.test(css)) {
      findings.push({ component, file: files[0] ? rel(files[0]) : rel(componentCssFile), status: "fail", reason: "Interactive source needs a visible focus contract." });
    }
    if (focusBlocksUseBoxShadow(css, component)) {
      findings.push({ component, file: files[0] ? rel(files[0]) : rel(componentCssFile), status: "fail", reason: "Focus must use outline/outline-offset, not box-shadow disguised as focus." });
    }
  }
  return findings;
}

function isAccessibilityCssLine(lineText) {
  return /(?:focus-visible|focus-within|prefers-reduced-motion|forced-colors|sr-only|screen-reader|aria-|disabled|touch-target|target|min-block-size|min-inline-size|outline|outline-offset|tabindex)/i.test(lineText);
}

function isAccessibilityCssDeclaration(property, lineText) {
  if (/^--/.test(property)) return /(?:a11y|focus|touch|target|reduced-motion|contrast|screen-reader|sr-only)/i.test(property);
  if (/^(?:block-size|inline-size)$/.test(property) && !/(?:touch|target|trigger|button|control|item)/i.test(lineText)) return false;
  return /^(?:outline|outline-offset|min-block-size|min-inline-size|block-size|inline-size|animation-duration|transition-duration)$/.test(property)
    || /prefers-reduced-motion|forced-colors/i.test(lineText);
}

function findAccessibilityCssDeclarations(file, source, customProperties) {
  const findings = [];
  for (const declaration of collectCssDeclarations(source)) {
    const lineText = declaration.raw;
    const property = declaration.property;
    if (!isAccessibilityCssDeclaration(property, lineText)) continue;
    const value = lineText.trim();
    if (!value || value.startsWith("/*")) continue;
    const line = declaration.line;
    const isTokenPackage = rel(file) === rel(tokenCssFile);
    if (isTokenPackage && /^\s*--(?:ref|sys)-/.test(lineText)) continue;
    const resolvesToA11y = valueResolvesToAccessibilityBoundary(lineText, customProperties);
    const usesLocalAlias = /var\(--[a-z0-9-]+/.test(lineText);
    const stripped = lineText.replace(/var\([^)]*\)/g, "");
    const hasRawFocus = /\b(?:outline|outline-offset)\s*:\s*(?:\d|0\s)/.test(stripped);
    const hasRawTarget = /\b(?:min-block-size|min-inline-size|block-size|inline-size)\s*:\s*(?:\d+(?:\.\d+)?(?:px|rem))/.test(stripped) && /target|button|trigger|control|item/i.test(lineText);
    const hasRawReducedMotion = /prefers-reduced-motion|animation-duration|transition-duration/.test(lineText) && /\b\d+(?:\.\d+)?m?s\b/.test(stripped);
    if (resolvesToA11y) {
      findings.push({ file: rel(file), line, value, status: "pass", reason: "Accessibility CSS resolves through Accessibility, dependent foundation, or component alias." });
      continue;
    }
    if (/^(?:outline|outline-offset)\s*:\s*(?:none|0)\b/.test(stripped)
      || /^(?:min-block-size|min-inline-size)\s*:\s*(?:0|auto|100%|max-content)\s*(?:;|$)/.test(stripped)) {
      findings.push({ file: rel(file), line, value, status: "pass", reason: "Accessibility-neutral reset value." });
      continue;
    }
    const status = hasRawFocus || hasRawTarget || hasRawReducedMotion ? "fail" : usesLocalAlias ? "review" : "review";
    findings.push({
      file: rel(file),
      line,
      value,
      status,
      reason: status === "fail"
        ? "Accessibility CSS bypasses foundation tokens for focus, target, or reduced-motion values."
        : "Accessibility CSS needs trace to Accessibility or a dependent foundation.",
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
  const spec = readJson(accessibilitySpecFile)?.artifacts?.foundations?.accessibility;
  const matrix = readJson(dependencyMatrixFile);
  const dependencyEdges = (matrix.dependencies ?? []).filter((dependency) => dependency.from === "Accessibility" || dependency.to === "Accessibility");
  const tokenDecls = findTokenDeclarations(tokenCss);
  const missingTokens = requiredTokens.filter((token) => !tokenCss.includes(`${token}:`));
  const roleIds = new Set((spec?.roles ?? []).map((role) => role.id));
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const docsOwnedAccessibilityTokens = findDocsOwnedAccessibilityTokens(docsCssFiles);
  const a11yRefPattern = /Accessibility|A11y|a11y|aria-|role=|focus|keyboard|contrast|touch|reduced motion|reduced-motion|screen reader|sys\.accessibility|sys\.a11y|ref\.a11y|--sys-a11y|--ref-a11y/i;
  const tokenUsePattern = /var\(--(?:ref|sys)-a11y-[a-z0-9-]+|var\(--component-[a-z0-9-]*(?:a11y|focus|target|contrast|motion)[a-z0-9-]*|var\(--comp-[a-z0-9-]*(?:a11y|focus|target|contrast|motion)[a-z0-9-]*/g;
  const primitiveRefs = collectArtifactRefs(primitiveDir, a11yRefPattern);
  const componentRefs = collectArtifactRefs(componentDir, a11yRefPattern);
  const patternRefs = collectArtifactRefs(patternDir, a11yRefPattern);
  const templateRefs = collectArtifactRefs(templateDir, a11yRefPattern);
  const docsCssUse = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), tokenUsePattern), 0);
  const packageCssUse = countMatches(componentCss, tokenUsePattern);
  const componentFindings = checkComponentAccessibility();
  const focusFindings = checkFocusContracts();
  const cssFindings = cssFiles.flatMap((file) => findAccessibilityCssDeclarations(file, readIfExists(file), customProperties));
  const cssFailures = cssFindings.filter((finding) => finding.status === "fail");
  const cssReviews = cssFindings.filter((finding) => finding.status === "review");
  const requiredEdges = [
    "Accessibility->State",
    "Accessibility->Momentum",
    "Accessibility->Voice",
    "Accessibility->Frame",
    "Accessibility->Energy",
    "Accessibility->Depth",
    "Iconography->Accessibility",
  ];
  const missingEdges = requiredEdges.filter((edge) => {
    const [from, to] = edge.split("->");
    return !dependencyEdges.some((dependency) => dependency.from === from && dependency.to === to);
  });

  const gaps = [];
  if (missingRoles.length) gaps.push(`Accessibility spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingTokens.length) gaps.push(`Token package is missing required Accessibility tokens: ${missingTokens.join(", ")}.`);
  if (docsOwnedAccessibilityTokens.length) gaps.push("Docs still declare Accessibility tokens instead of consuming package-owned tokens.");
  if (componentFindings.length) gaps.push("Some components have missing Accessibility guidance, coverage, or required semantics.");
  if (focusFindings.length) gaps.push("Some interactive components have missing or invalid focus contracts.");
  if (cssFailures.length) gaps.push("Some CSS accessibility declarations bypass foundation tokens.");
  if (cssReviews.length) gaps.push("Some CSS accessibility declarations need trace review.");
  if (missingEdges.length) gaps.push(`Foundation dependency matrix is missing Accessibility edges: ${missingEdges.join(", ")}.`);

  let status = "pass";
  if (missingRoles.length || missingTokens.length || docsOwnedAccessibilityTokens.length || componentFindings.length || focusFindings.length || cssFailures.length || missingEdges.length) status = "fail";
  else if (cssReviews.length || patternRefs.count < 1 || templateRefs.count < 1) status = "review";

  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    foundation: "Accessibility",
    status,
    principle: "Accessibility must govern name, role, state, keyboard, focus, touch target, contrast, reduced motion, recovery, localization, and non-visual alternatives from foundations through templates.",
    tokenOwnership: {
      tokenCss: rel(tokenCssFile),
      declarations: tokenDecls.length,
      requiredTokens,
      missingTokens,
      docsOwnedAccessibilityTokens,
    },
    specContract: {
      file: rel(accessibilitySpecFile),
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
    componentSemantics: {
      checkedComponents: goldComponents.length,
      failures: componentFindings,
    },
    focusContracts: {
      failures: focusFindings,
    },
    accessibilityCssDeclarations: {
      scannedFiles: cssFiles.map(rel),
      totalFindings: cssFindings.length,
      failures: cssFailures,
      reviews: cssReviews,
      passCount: cssFindings.length - cssFailures.length - cssReviews.length,
    },
    missingDependencyEdges: missingEdges,
    gaps,
    nextActions: [
      "Add missing foundation dependency edges before claiming Accessibility cascades through the full system.",
      "Fix fail-level component semantics and focus contract issues before visual parity claims.",
      "Replace raw focus, target, and reduced-motion values with Accessibility, dependent foundation, or component aliases.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# Accessibility Cascade Audit");
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
  if (report.missingDependencyEdges.length) {
    lines.push("");
    lines.push("Missing expected edges:");
    for (const edge of report.missingDependencyEdges) lines.push(`- ${edge}`);
  }
  lines.push("");
  lines.push("## Gaps");
  lines.push("");
  if (report.gaps.length) for (const gap of report.gaps) lines.push(`- ${gap}`);
  else lines.push("- No fail-level Accessibility cascade gaps detected.");
  lines.push("");
  lines.push("## Component Semantics Failures");
  lines.push("");
  const componentFailures = [...report.componentSemantics.failures, ...report.focusContracts.failures];
  if (componentFailures.length) {
    lines.push("| Component | File | Reason |");
    lines.push("| --- | --- | --- |");
    for (const finding of componentFailures.slice(0, 40)) {
      lines.push(`| ${finding.component} | ${finding.file} | ${finding.reason.replace(/\|/g, "\\|")} |`);
    }
  } else {
    lines.push("- No fail-level component Accessibility semantics gaps found.");
  }
  lines.push("");
  lines.push("## Accessibility CSS Failures");
  lines.push("");
  if (report.accessibilityCssDeclarations.failures.length) {
    lines.push("| File | Line | Value |");
    lines.push("| --- | ---: | --- |");
    for (const finding of report.accessibilityCssDeclarations.failures.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | \`${finding.value.replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No raw Accessibility CSS bypasses found in scanned CSS.");
  }
  lines.push("");
  lines.push("## Accessibility Trace Reviews");
  lines.push("");
  if (report.accessibilityCssDeclarations.reviews.length) {
    lines.push("| File | Line | Value |");
    lines.push("| --- | ---: | --- |");
    for (const finding of report.accessibilityCssDeclarations.reviews.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | \`${finding.value.replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No Accessibility trace reviews found.");
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
      console.error("Accessibility cascade audit is stale. Run: node packages/audit/scripts/report-foundation-accessibility-cascade.js");
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
    componentSemanticFailures: report.componentSemantics.failures.length,
    focusFailures: report.focusContracts.failures.length,
    cssFailures: report.accessibilityCssDeclarations.failures.length,
    cssTraceReviews: report.accessibilityCssDeclarations.reviews.length,
    missingDependencyEdges: report.missingDependencyEdges.length,
  }, null, 2));
}

main();
