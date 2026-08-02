const {
  add,
  componentImplementationStatusFile,
  docsAppDir,
  fs,
  goldComponents,
  path,
  read,
  readJson,
} = require("./audit-context.js");

const allowedStatuses = new Set(["package-component", "interactive-fixture", "fixture-only", "pattern-candidate"]);
const reusableImplementations = new Set(["accordion", "audit-event", "avatar", "badge", "biometric-prompt", "breadcrumbs", "button", "card", "card-summary", "card-expiry-input", "card-number-input", "card-security-code-input", "chart-panel", "checkbox", "chip", "combobox", "country-selector", "date-picker", "date-range-picker", "dialog", "drawer", "empty-state", "error-panel", "floating-action-button", "icon-button", "inline-validation", "kpi-tile", "list", "animated-moment", "menu", "motion-boundary", "movement-row", "code-input", "pagination", "phone-input", "popover", "progress-indicator", "quick-action", "radio-button", "route-summary", "segmented-control", "select", "skeleton", "spinner", "slider", "station-pin", "stepper", "switch", "table", "tabs", "tag", "text-area", "input", "toast", "tooltip", "tree-view"]);

const rawControlOwners = {
  button: new Set(["button"]),
  checkbox: new Set(["input"]),
  "icon-button": new Set(["button"]),
  "radio-button": new Set(["input"]),
  select: new Set(["button", "select"]),
  slider: new Set(["input"]),
  switch: new Set(["input"]),
  table: new Set(["button", "table"]),
  "text-area": new Set(["textarea"]),
  "input": new Set(["input"]),
};

const knownComponentFiles = {
  button: "gold-button-docs.js",
  card: "gold-card-docs.js",
  checkbox: "gold-checkbox-docs.js",
  "icon-button": "gold-icon-button-docs.js",
  "radio-button": "gold-radio-button-docs.js",
  select: "gold-select-docs.js",
  switch: "gold-switch-docs.js",
  "text-area": "gold-text-area-docs.js",
  "input": "gold-input-docs.js",
};

function toPascal(id) {
  return id.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
}

function lineNumber(text, index) {
  return text.slice(0, index).split("\n").length;
}

function collectSimpleDemoRanges(text) {
  const matches = [...text.matchAll(/^\s{2}if \(component === "([^"]+)"\) \{/gm)];
  return matches.map((match, index) => ({
    component: match[1],
    start: match.index,
    end: matches[index + 1]?.index ?? text.length,
  }));
}

function addNativeControlWarning(file, line, component, tag) {
  add(
    "warnings",
    file,
    line,
    `${component} demo renders native <${tag}> directly. Confirm it is the primitive owner or replace it with a Design System primitive/docs adapter.`
  );
}

function isApprovedDocsPrimitive(matchText) {
  return /\sdata-docs-primitive=["'](?:button|input|select|textarea|table)["']/.test(matchText);
}

function auditNativeControlsInSimpleDemos() {
  const file = path.join(docsAppDir, "gold-simple-component-docs.js");
  if (!fs.existsSync(file)) return;
  const text = read(file);
  for (const range of collectSimpleDemoRanges(text)) {
    const allowed = rawControlOwners[range.component] ?? new Set();
    const chunk = text.slice(range.start, range.end);
    for (const match of chunk.matchAll(/<\s*(button|input|select|textarea|table)\b[^>]*>/g)) {
      const tag = match[1];
      if (isApprovedDocsPrimitive(match[0])) continue;
      if (allowed.has(tag)) continue;
      addNativeControlWarning(file, lineNumber(text, range.start + match.index), range.component, tag);
    }
  }
}

function auditNativeControlsInDedicatedDemos() {
  for (const [component, fileName] of Object.entries(knownComponentFiles)) {
    const file = path.join(docsAppDir, fileName);
    if (!fs.existsSync(file)) continue;
    const allowed = rawControlOwners[component] ?? new Set();
    const text = read(file);
    for (const match of text.matchAll(/<\s*(button|input|select|textarea|table)\b[^>]*>/g)) {
      const tag = match[1];
      if (isApprovedDocsPrimitive(match[0])) continue;
      if (allowed.has(tag)) continue;
      addNativeControlWarning(file, lineNumber(text, match.index), component, tag);
    }
  }

  const finalFile = path.join(docsAppDir, "gold-final-keep-component-demos.js");
  if (!fs.existsSync(finalFile)) return;
  const finalText = read(finalFile);
  const functionRanges = [...finalText.matchAll(/^function ([a-zA-Z0-9]+)Demo\(demo\) \{/gm)].map((match, index, all) => ({
    component: match[1].replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
    start: match.index,
    end: all[index + 1]?.index ?? finalText.length,
  }));
  for (const range of functionRanges) {
    const allowed = rawControlOwners[range.component] ?? new Set();
    const chunk = finalText.slice(range.start, range.end);
    for (const match of chunk.matchAll(/<\s*(button|input|select|textarea|table)\b[^>]*>/g)) {
      const tag = match[1];
      if (isApprovedDocsPrimitive(match[0])) continue;
      if (allowed.has(tag)) continue;
      addNativeControlWarning(finalFile, lineNumber(finalText, range.start + match.index), range.component, tag);
    }
  }
}

function checkImplementationStatus() {
  const status = readJson(componentImplementationStatusFile);
  if (!status?.components) {
    add("errors", componentImplementationStatusFile, 1, "Component implementation status inventory is missing or invalid.");
    return;
  }

  const seen = new Set(Object.keys(status.components));
  for (const component of goldComponents) {
    const entry = status.components[component];
    if (!entry) {
      add("errors", componentImplementationStatusFile, 1, `${component} is missing implementation status metadata.`);
      continue;
    }
    if (!allowedStatuses.has(entry.status)) {
      add("errors", componentImplementationStatusFile, 1, `${component} has unsupported implementation status: ${entry.status}.`);
    }
    if (typeof entry.patternRisk !== "boolean") {
      add("errors", componentImplementationStatusFile, 1, `${component} implementation status must include boolean patternRisk.`);
    }
    if (!String(entry.notes ?? "").trim()) {
      add("errors", componentImplementationStatusFile, 1, `${component} implementation status needs notes explaining the audit decision.`);
    }
    if (entry.status === "package-component" && !reusableImplementations.has(component)) {
      add("errors", componentImplementationStatusFile, 1, `${component} is marked package-component but no reusable implementation contract is registered.`);
    }
    seen.delete(component);
  }

  for (const extra of seen) {
    add("errors", componentImplementationStatusFile, 1, `${extra} has implementation status metadata but is not in goldComponents.`);
  }

  for (const component of reusableImplementations) {
    const entry = status.components[component];
    if (entry?.status !== "package-component") {
      add("errors", componentImplementationStatusFile, 1, `${component} has a reusable ${toPascal(component)} implementation and should be marked package-component.`);
    }
  }

  auditNativeControlsInSimpleDemos();
  auditNativeControlsInDedicatedDemos();
}

module.exports = { checkImplementationStatus };
