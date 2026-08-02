const {
  add,
  componentCopyFile,
  path,
  read,
  readJson,
  readSpec,
  resolveBoundaryPath,
  root,
} = require("./audit-context.js");

const stateContractFile = path.join(root, "docs/audits/state-quality-contract.json");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");

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

function checkPrecedence(component, states, precedence) {
  const missing = states.filter((state) => !precedence.includes(state));
  const extra = precedence.filter((state) => !states.includes(state));
  const repeated = precedence.filter((state, index) => precedence.indexOf(state) !== index);

  if (missing.length) add("errors", stateContractFile, 1, `${component} statePrecedence missing declared states: ${missing.join(", ")}.`);
  if (extra.length) add("errors", stateContractFile, 1, `${component} statePrecedence includes undeclared states: ${extra.join(", ")}.`);
  if (repeated.length) add("errors", stateContractFile, 1, `${component} statePrecedence repeats states: ${[...new Set(repeated)].join(", ")}.`);
  const terminalStates = ["closed", "unknown"];
  const hasTerminalFallback = terminalStates.some((state) => states.includes(state));
  if (states.includes("default") && !hasTerminalFallback && precedence.at(-1) !== "default") {
    add("errors", stateContractFile, 1, `${component} statePrecedence must keep default as the lowest-priority fallback.`);
  }
  if (states.includes("default") && hasTerminalFallback && !terminalStates.includes(precedence.at(-1))) {
    add("errors", stateContractFile, 1, `${component} statePrecedence must end with an explicit terminal fallback state.`);
  }
  if (states.includes("disabled") && precedence[0] !== "disabled") {
    add("errors", stateContractFile, 1, `${component} statePrecedence must put disabled first when disabled exists.`);
  }
  if (states.includes("focus") && states.includes("hover") && !hasBefore(precedence, "focus", "hover")) {
    add("errors", stateContractFile, 1, `${component} statePrecedence must keep focus above hover.`);
  }
  if (states.includes("error") && states.includes("hover") && !hasBefore(precedence, "error", "hover")) {
    add("errors", stateContractFile, 1, `${component} statePrecedence must keep error above hover.`);
  }
}

function checkStateDemos(component, states, copy) {
  const demos = copy?.states?.demos ?? [];
  const demoStates = demos.map((demo) => normalize(demo?.state || demo?.label)).filter(Boolean);
  const missing = states.filter((state) => !demoStates.includes(state));
  const extra = demoStates.filter((state) => !states.includes(state));

  if (missing.length) add("errors", componentCopyFile, 1, `${component} States demos missing declared states: ${missing.join(", ")}.`);
  if (extra.length) add("errors", componentCopyFile, 1, `${component} States demos include undeclared states: ${extra.join(", ")}.`);
}

function checkStateCss() {
  const css = read(tokenCssFile);
  for (const token of [
    "--ref-state-opacity-disabled",
    "--ref-state-overlay-hover",
    "--ref-state-focus-ring-width",
    "--ref-state-precedence-disabled",
    "--sys-state-disabled-opacity",
    "--sys-state-hover-overlay",
    "--sys-state-pressed-overlay",
    "--sys-state-selected-overlay",
    "--sys-state-focus-ring",
    "--sys-state-loading-spin",
  ]) {
    if (!css.includes(token)) add("errors", tokenCssFile, 1, `State token must be package-owned: ${token}.`);
  }
}

function checkStateContracts() {
  const contract = readJson(stateContractFile);
  if (!contract?.requiredOrderRules?.length || !contract?.requiredDemoRules?.length) {
    add("errors", stateContractFile, 1, "State quality contract must declare order and demo rules.");
  }

  const spec = readSpec()?.artifacts?.components ?? {};
  const copy = readJson(componentCopyFile)?.components ?? {};

  for (const [component, componentSpec] of Object.entries(spec)) {
    const states = stateIds(componentSpec.states);
    const precedence = precedenceIds(componentSpec.statePrecedence);
    if (!states.length || !precedence.length) continue;
    checkPrecedence(component, states, precedence);
    checkStateDemos(component, states, copy[component]);
  }

  checkStateCss();
}

module.exports = { checkStateContracts };
