#!/usr/bin/env node

const {
  componentCopyFile,
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
const jsonOutput = path.join(outputDir, "foundation-state-cascade-audit.json");
const markdownOutput = path.join(outputDir, "foundation-state-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const stateSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/foundations/state.json");
const primitiveDir = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const dependencyMatrixFile = path.join(root, "docs/audits/foundation-dependency-matrix.json");

const requiredRoles = ["default", "hover", "focus", "pressed", "selected", "loading", "disabled", "error"];
const requiredTokens = [
  "--ref-state-opacity-disabled",
  "--ref-state-opacity-faint",
  "--ref-state-opacity-subtle",
  "--ref-state-opacity-low",
  "--ref-state-opacity-muted",
  "--ref-state-opacity-soft",
  "--ref-state-overlay-hover",
  "--ref-state-overlay-pressed",
  "--ref-state-overlay-selected",
  "--ref-state-focus-ring-width",
  "--ref-state-focus-ring-offset",
  "--ref-state-loading-spin",
  "--ref-state-precedence-disabled",
  "--ref-state-precedence-loading",
  "--ref-state-precedence-error",
  "--ref-state-precedence-focus",
  "--ref-state-precedence-hover",
  "--sys-state-disabled-opacity",
  "--sys-state-muted-opacity",
  "--sys-state-focus-ring",
  "--sys-state-focus-offset",
  "--sys-state-hover-overlay",
  "--sys-state-pressed-overlay",
  "--sys-state-selected-overlay",
  "--sys-state-loading-spin",
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

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function stateIds(states) {
  return (Array.isArray(states) ? states : [])
    .map((state) => normalize(typeof state === "string" ? state : state?.id ?? state?.name))
    .filter(Boolean);
}

function precedenceIds(value) {
  return normalize(value).split(/\s*>\s*|\s*,\s*/).filter(Boolean);
}

function hasBefore(list, first, second) {
  const firstIndex = list.indexOf(first);
  const secondIndex = list.indexOf(second);
  return firstIndex >= 0 && secondIndex >= 0 && firstIndex < secondIndex;
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

function isStateAllowedToken(name) {
  return /^--(?:ref|sys)-state-/.test(name)
    || /^--sys-(?:color|energy|a11y|momentum|frame|depth)-/.test(name)
    || /^--(?:component|comp)-/.test(name);
}

function aliasResolvesToStateBoundary(name, customProperties, seen = new Set()) {
  if (isStateAllowedToken(name)) return true;
  if (seen.has(name)) return false;
  seen.add(name);
  const values = customProperties.get(name) ?? [];
  if (!values.length) return false;
  return values.some((value) => {
    const deps = varNames(value);
    if (!deps.length) return /^-?\d*\.?\d+(?:%|px|rem|em|deg)?$|^(?:none|auto|inherit|transparent)$/.test(value);
    return deps.some((dep) => aliasResolvesToStateBoundary(dep, customProperties, new Set(seen)));
  });
}

function valueResolvesToStateBoundary(value, customProperties) {
  const deps = varNames(value);
  if (!deps.length) return false;
  return deps.some((dep) => aliasResolvesToStateBoundary(dep, customProperties));
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
  return [...css.matchAll(/--(?:ref|sys)-state-[a-z0-9-]+(?=\s*:)/g)].map((match) => match[0]);
}

function findDocsOwnedStateTokens(files) {
  const owned = [];
  for (const file of files) {
    const source = readIfExists(file);
    for (const match of source.matchAll(/--(?:ref|sys)-state-[a-z0-9-]+(?=\s*:)/g)) {
      owned.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        token: match[0],
        status: "fail",
        reason: "Docs must consume package-owned State tokens, not redeclare them.",
      });
    }
  }
  return owned;
}

function findObjectsWithStates(value, out = []) {
  if (!value || typeof value !== "object") return out;
  if (Array.isArray(value)) {
    for (const item of value) findObjectsWithStates(item, out);
    return out;
  }
  if (Array.isArray(value.states)) out.push(value);
  for (const item of Object.values(value)) findObjectsWithStates(item, out);
  return out;
}

function collectComponentStateContracts() {
  const contracts = new Map();
  for (const file of walkFiles(componentDir, (item) => item.endsWith(".json"))) {
    const json = readJson(file);
    const id = artifactId(file, componentDir);
    const candidates = findObjectsWithStates(json);
    const best = candidates.find((candidate) => candidate.statePrecedence) ?? candidates[0];
    if (!best) continue;
    const states = stateIds(best.states);
    if (!states.length) continue;
    const existing = contracts.get(id);
    if (!existing || (!existing.precedence.length && best.statePrecedence)) {
      contracts.set(id, {
        id,
        file: rel(file),
        states,
        precedence: precedenceIds(best.statePrecedence),
      });
    }
  }
  return [...contracts.values()].sort((a, b) => a.id.localeCompare(b.id));
}

function checkComponentStateContract(contract, copy) {
  const findings = [];
  const { id, states, precedence } = contract;
  if (!precedence.length) {
    findings.push({ component: id, file: contract.file, status: "fail", reason: "Component declares states but no statePrecedence." });
    return findings;
  }
  const missing = states.filter((state) => !precedence.includes(state));
  const extra = precedence.filter((state) => !states.includes(state));
  const repeated = precedence.filter((state, index) => precedence.indexOf(state) !== index);
  if (missing.length) findings.push({ component: id, file: contract.file, status: "fail", reason: `statePrecedence missing states: ${missing.join(", ")}.` });
  if (extra.length) findings.push({ component: id, file: contract.file, status: "fail", reason: `statePrecedence includes undeclared states: ${extra.join(", ")}.` });
  if (repeated.length) findings.push({ component: id, file: contract.file, status: "fail", reason: `statePrecedence repeats states: ${[...new Set(repeated)].join(", ")}.` });
  const terminalStates = ["closed", "unknown"];
  const hasTerminalFallback = terminalStates.some((state) => states.includes(state));
  if (states.includes("default") && !hasTerminalFallback && precedence.at(-1) !== "default") {
    findings.push({ component: id, file: contract.file, status: "fail", reason: "statePrecedence must keep default as the lowest-priority fallback." });
  }
  if (states.includes("default") && hasTerminalFallback && !terminalStates.includes(precedence.at(-1))) {
    findings.push({ component: id, file: contract.file, status: "fail", reason: "statePrecedence must end with an explicit terminal fallback state." });
  }
  if (states.includes("disabled") && precedence[0] !== "disabled") {
    findings.push({ component: id, file: contract.file, status: "fail", reason: "disabled must be first when it exists." });
  }
  if (states.includes("focus") && states.includes("hover") && !hasBefore(precedence, "focus", "hover")) {
    findings.push({ component: id, file: contract.file, status: "fail", reason: "focus must outrank hover." });
  }
  if (states.includes("error") && states.includes("hover") && !hasBefore(precedence, "error", "hover")) {
    findings.push({ component: id, file: contract.file, status: "fail", reason: "error must outrank hover." });
  }
  if (states.includes("loading") && states.includes("pressed") && !hasBefore(precedence, "loading", "pressed")) {
    findings.push({ component: id, file: contract.file, status: "fail", reason: "loading must outrank pressed to block duplicate activation." });
  }

  const copyStates = copy?.[id]?.states?.demos?.map((demo) => normalize(demo?.state || demo?.label)).filter(Boolean) ?? [];
  if (copyStates.length) {
    const missingDemos = states.filter((state) => !copyStates.includes(state));
    if (missingDemos.length) {
      findings.push({ component: id, file: componentCopyFile ? rel(componentCopyFile) : contract.file, status: "review", reason: `states docs do not demo: ${missingDemos.join(", ")}.` });
    }
  } else {
    findings.push({ component: id, file: componentCopyFile ? rel(componentCopyFile) : contract.file, status: "review", reason: "No states demos found in component copy." });
  }
  return findings;
}

function isStateLine(lineText) {
  return /(?:\:hover|\:focus-visible|\:focus-within|\:active|\:disabled|\:has\([^)]*disabled|\[disabled\]|\[aria-(?:selected|pressed|invalid|expanded|busy|disabled)|\[data-state=|\[data-(?:selected|disabled|loading|open|active|pressed)|\.(?:is-|has-)[a-z0-9-]+)/i.test(lineText);
}

function evaluateStateDeclaration(file, line, property, value, customProperties) {
  const raw = `${property}: ${value};`;
  const delegatedProperties = new Set([
    "animation",
    "animation-name",
    "animation-play-state",
    "border-block-start-color",
    "border-color",
    "box-shadow",
    "content",
    "cursor",
    "display",
    "font-variant-numeric",
    "font-variation-settings",
    "grid-template-columns",
    "grid-template-rows",
    "inline-size",
    "inset",
    "max-inline-size",
    "outline",
    "pointer-events",
    "position",
    "stroke-width",
    "transform",
    "visibility",
  ]);
  const usesState = /var\(--(?:sys|ref)-state-/.test(value);
  const usesFoundation = /var\(--sys-(?:color|energy|a11y|momentum|frame|depth)-|var\(--ref-(?:energy|frame)-/.test(value);
  const usesComponentAlias = /var\(--(?:component|comp)-/.test(value);
  const usesLocalAlias = /var\(--[a-z0-9-]+/.test(value);
  const isResolvedAlias = usesLocalAlias && valueResolvesToStateBoundary(value, customProperties);
  const stripped = value.replace(/var\([^)]*\)/g, "");
  const hasRawColor = /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|\b(?:red|blue|green|yellow|black|white)\b/i.test(stripped);
  const hasRawOpacity = property === "opacity" && /^(?:0?\.\d+|1(?:\.0+)?)$/.test(stripped.trim());
  const hasRawFocus = /^(?:outline|box-shadow)$/.test(property) && /^(?:\d|0\s)/.test(stripped.trim());
  if (usesState || usesFoundation || usesComponentAlias || isResolvedAlias) {
    return { file: rel(file), line, value: raw, status: "pass", reason: "State styling resolves through State, dependent foundation, or component/local alias." };
  }
  if (delegatedProperties.has(property)) {
    return { file: rel(file), line, value: raw, status: "pass", reason: "State condition delegates this declaration to behavior, Momentum, Iconography, Accessibility, Frame, or Depth." };
  }
  const status = hasRawColor || hasRawOpacity || hasRawFocus ? "fail" : usesLocalAlias ? "pass" : "review";
  return {
    file: rel(file),
    line,
    value: raw,
    status,
    reason: status === "fail"
      ? "State styling bypasses State with raw color, opacity, focus, or disabled values."
      : status === "pass"
        ? "State styling uses a local alias; dependent foundation audits own its internals."
        : "State styling needs trace to State or a component alias.",
  };
}

function findStateCssDeclarations(file, source, customProperties) {
  const findings = [];
  const isTokenPackage = rel(file) === rel(tokenCssFile);
  if (isTokenPackage) return findings;
  const rulePattern = /(?<selector>[^{}]+)\{(?<body>[^{}]+)\}/g;
  let rule;
  while ((rule = rulePattern.exec(source))) {
    const selector = rule.groups.selector.trim();
    if (!isStateLine(selector)) continue;
    const body = rule.groups.body;
    const declarationPattern = /(?<property>[a-z-]+)\s*:\s*(?<value>[^;]+);/g;
    let declaration;
    while ((declaration = declarationPattern.exec(body))) {
      const property = declaration.groups.property;
      if (property.startsWith("--")) continue;
      const value = declaration.groups.value.trim();
      const absoluteIndex = rule.index + rule[0].indexOf(body) + declaration.index;
      findings.push(evaluateStateDeclaration(file, lineNumber(source, absoluteIndex), property, value, customProperties));
    }
  }
  return findings;
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const docsCssFiles = docsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const cssFiles = [componentCssFile, ...docsCssFiles].filter((file) => fs.existsSync(file));
  const customProperties = buildCustomPropertyMap([tokenCss, ...cssFiles.map((file) => readIfExists(file))]);
  const spec = readJson(stateSpecFile)?.artifacts?.foundations?.state;
  const matrix = readJson(dependencyMatrixFile);
  const dependencyEdges = (matrix.dependencies ?? []).filter((dependency) => dependency.from === "State" || dependency.to === "State");
  const tokenDecls = findTokenDeclarations(tokenCss);
  const missingTokens = requiredTokens.filter((token) => !tokenCss.includes(`${token}:`));
  const roleIds = new Set((spec?.roles ?? []).map((role) => role.id));
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const docsOwnedStateTokens = findDocsOwnedStateTokens(docsCssFiles);
  const stateRefPattern = /State|Disabled|Loading|Focus|Selected|Pressed|Hover|Error|statePrecedence|sys\.state|ref\.state|--sys-state|--ref-state|aria-(?:selected|pressed|invalid|busy|disabled)/i;
  const tokenUsePattern = /var\(--(?:ref|sys)-state-[a-z0-9-]+|var\(--component-[a-z0-9-]*(?:state|disabled|focus|hover|pressed|selected|loading|error)[a-z0-9-]*|var\(--comp-[a-z0-9-]*(?:state|disabled|focus|hover|pressed|selected|loading|error)[a-z0-9-]*/g;
  const primitiveRefs = collectArtifactRefs(primitiveDir, stateRefPattern);
  const componentRefs = collectArtifactRefs(componentDir, stateRefPattern);
  const patternRefs = collectArtifactRefs(patternDir, stateRefPattern);
  const templateRefs = collectArtifactRefs(templateDir, stateRefPattern);
  const docsCssUse = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), tokenUsePattern), 0);
  const packageCssUse = countMatches(componentCss, tokenUsePattern);
  const componentCopy = readJson(componentCopyFile)?.components ?? {};
  const componentStateContracts = collectComponentStateContracts();
  const componentStateFindings = componentStateContracts.flatMap((contract) => checkComponentStateContract(contract, componentCopy));
  const stateCssFindings = cssFiles.flatMap((file) => findStateCssDeclarations(file, readIfExists(file), customProperties));
  const stateCssFailures = stateCssFindings.filter((finding) => finding.status === "fail");
  const stateCssReviews = stateCssFindings.filter((finding) => finding.status === "review");
  const stateContractFailures = componentStateFindings.filter((finding) => finding.status === "fail");
  const stateContractReviews = componentStateFindings.filter((finding) => finding.status === "review");
  const requiredEdges = ["State->Energy", "State->Frame", "Accessibility->State"];
  const missingEdges = requiredEdges.filter((edge) => {
    const [from, to] = edge.split("->");
    return !dependencyEdges.some((dependency) => dependency.from === from && dependency.to === to);
  });

  const gaps = [];
  if (missingRoles.length) gaps.push(`State spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingTokens.length) gaps.push(`Token package is missing required State tokens: ${missingTokens.join(", ")}.`);
  if (docsOwnedStateTokens.length) gaps.push("Docs still declare State tokens instead of consuming package-owned tokens.");
  if (stateContractFailures.length) gaps.push("Some components declare states without valid precedence.");
  if (stateContractReviews.length) gaps.push("Some component state docs need demo coverage review.");
  if (stateCssFailures.length) gaps.push("Some CSS state declarations bypass State with raw values.");
  if (stateCssReviews.length) gaps.push("Some CSS state declarations need State trace review.");
  if (missingEdges.length) gaps.push(`Foundation dependency matrix is missing State edges: ${missingEdges.join(", ")}.`);

  let status = "pass";
  if (missingRoles.length || missingTokens.length || docsOwnedStateTokens.length || stateContractFailures.length || stateCssFailures.length || missingEdges.length) status = "fail";
  else if (stateContractReviews.length || stateCssReviews.length || patternRefs.count < 1 || templateRefs.count < 1) status = "review";

  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    foundation: "State",
    status,
    principle: "State must resolve interaction condition, precedence, disabled/loading/error behavior, and accessible state semantics before any component, pattern, or template applies visual treatment.",
    tokenOwnership: {
      tokenCss: rel(tokenCssFile),
      declarations: tokenDecls.length,
      requiredTokens,
      missingTokens,
      docsOwnedStateTokens,
    },
    specContract: {
      file: rel(stateSpecFile),
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
    componentStateContracts: {
      scannedComponents: componentStateContracts.length,
      failures: stateContractFailures,
      reviews: stateContractReviews,
      passCount: Math.max(0, componentStateContracts.length - new Set(componentStateFindings.map((finding) => finding.component)).size),
    },
    stateCssDeclarations: {
      scannedFiles: cssFiles.map(rel),
      totalFindings: stateCssFindings.length,
      failures: stateCssFailures,
      reviews: stateCssReviews,
      passCount: stateCssFindings.length - stateCssFailures.length - stateCssReviews.length,
    },
    gaps,
    nextActions: [
      "Fix fail-level state precedence issues before changing component visuals.",
      "Replace raw state styling with sys-state, dependent foundation, or component aliases where product UI state is being represented.",
      "When a component is audited 1:1, verify disabled, loading, error, focus, selected, hover, and pressed precedence from this report before visual parity.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# State Cascade Audit");
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
  else lines.push("- No fail-level State cascade gaps detected.");
  lines.push("");
  lines.push("## Component State Contract Failures");
  lines.push("");
  if (report.componentStateContracts.failures.length) {
    lines.push("| Component | File | Reason |");
    lines.push("| --- | --- | --- |");
    for (const finding of report.componentStateContracts.failures.slice(0, 40)) {
      lines.push(`| ${finding.component} | ${finding.file} | ${finding.reason.replace(/\|/g, "\\|")} |`);
    }
  } else {
    lines.push("- No fail-level component state precedence gaps found.");
  }
  lines.push("");
  lines.push("## State CSS Failures");
  lines.push("");
  if (report.stateCssDeclarations.failures.length) {
    lines.push("| File | Line | Value |");
    lines.push("| --- | ---: | --- |");
    for (const finding of report.stateCssDeclarations.failures.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | \`${finding.value.replace(/\|/g, "\\|")}\` |`);
    }
  } else {
    lines.push("- No raw state CSS bypasses found in scanned CSS.");
  }
  lines.push("");
  lines.push("## State Trace Reviews");
  lines.push("");
  const reviews = [...report.componentStateContracts.reviews, ...report.stateCssDeclarations.reviews];
  if (reviews.length) {
    lines.push("| Source | Location | Reason |");
    lines.push("| --- | --- | --- |");
    for (const finding of reviews.slice(0, 40)) {
      const source = finding.component ? finding.component : finding.file;
      const location = finding.line ? `${finding.file}:${finding.line}` : finding.file;
      const reason = finding.reason ?? finding.value;
      lines.push(`| ${source} | ${location} | ${String(reason).replace(/\|/g, "\\|")} |`);
    }
  } else {
    lines.push("- No State trace reviews found.");
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
      console.error("State cascade audit is stale. Run: node packages/audit/scripts/report-foundation-state-cascade.js");
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
    componentStateFailures: report.componentStateContracts.failures.length,
    componentStateReviews: report.componentStateContracts.reviews.length,
    stateCssFailures: report.stateCssDeclarations.failures.length,
    stateCssReviews: report.stateCssDeclarations.reviews.length,
  }, null, 2));
}

main();
