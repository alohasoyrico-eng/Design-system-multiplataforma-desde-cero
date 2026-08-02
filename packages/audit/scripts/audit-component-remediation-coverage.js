const {
  path,
  add,
  read,
  readJson,
} = require("./audit-context.js");

const backlogFile = path.join(__dirname, "../../../packages/content/content/component-quality-backlog.json");
const behaviorFile = path.join(__dirname, "../../../packages/content/content/component-behavior-contracts.json");
const packageFile = path.join(__dirname, "../../../package.json");
const interactionAuditFile = path.join(__dirname, "audit-component-demo-interactions.mjs");
const registryAuditFile = path.join(__dirname, "audit-component-demo-registry.mjs");
const smokeTestFile = path.join(__dirname, "../../../packages/components/test/smoke.test.mjs");

const interactionEvidence = {
  "chip": "chip",
  "tabs": "tabs",
  "tooltip": "tooltip",
  "toast": "toast",
  "dialog": "overlay",
  "menu": "menu",
  "drawer": "overlay",
  "accordion": "accordion",
  "table": "table",
  "slider": "slider",
  "code-input": "code-input",
  "phone-input": "phone-input",
  "card-number-input": "card-number-input",
  "card-expiry-input": "card-expiry-input",
  "card-security-code-input": "card-security-code-input",
  "date-picker": "date-picker",
  "date-range-picker": "date-range-picker",
  "segmented-control": "segmented-control",
  "popover": "popover",
  "biometric-prompt": "smoke",
  "pagination": "pagination",
  "tree-view": "tree-view",
};

function checkComponentRemediationCoverage() {
  const backlog = readJson(backlogFile);
  const behavior = readJson(behaviorFile);
  const packageJson = readJson(packageFile);
  const interactionAudit = read(interactionAuditFile);
  const registryAudit = read(registryAuditFile);
  const smokeTest = read(smokeTestFile);
  const pending = backlog?.contractPending ?? [];
  const behaviorWatchlist = backlog?.behaviorWatchlist ?? [];
  const accepted = backlog?.accepted ?? [];
  const scopeDecisionPending = backlog?.scopeDecisionPending ?? [];
  const renameRequired = backlog?.renameRequired ?? [];
  const behaviorComponents = behavior?.components ?? {};
  const validateScript = [
    packageJson?.scripts?.validate ?? "",
    packageJson?.scripts?.["validate:integration"] ?? "",
  ].join(" ");

  if (!validateScript.includes("audit:component-demo-registry")) {
    add("errors", packageFile, 1, "validate must include registry coverage for contract-pending components.");
  }
  if (!validateScript.includes("audit:component-demo-interactions")) {
    add("errors", packageFile, 1, "validate must include interaction coverage for contract-pending components.");
  }
  if (!registryAudit.includes("data-component-source=\"package\"")) {
    add("errors", registryAuditFile, 1, "Registry audit must prove demos render package-backed components.");
  }
  if (JSON.stringify(behaviorWatchlist) !== JSON.stringify(pending)) {
    add("errors", backlogFile, 1, "behaviorWatchlist must match contractPending until the legacy validation key is renamed.");
  }
  if (!accepted.includes("motion-boundary")) {
    add("errors", backlogFile, 1, "Motion Boundary scope has been resolved and must remain accepted as a bounded component wrapper.");
  }
  if (scopeDecisionPending.includes("motion-boundary")) {
    add("errors", backlogFile, 1, "Motion Boundary must not remain scopeDecisionPending after its bounded component decision.");
  }
  if (!accepted.includes("animated-moment")) {
    add("errors", backlogFile, 1, "Animated Moment rename has been resolved and must remain accepted as a bounded animated cue component.");
  }
  if (scopeDecisionPending.includes("animated-moment") || renameRequired.includes("animated-moment")) {
    add("errors", backlogFile, 1, "Animated Moment must not remain scopeDecisionPending or renameRequired after the Lottie-specific naming was removed.");
  }

  const missingCoverage = pending.filter((id) => !interactionEvidence[id]);
  if (missingCoverage.length) {
    add("errors", interactionAuditFile, 1, `Missing remediation interaction evidence mapping for: ${missingCoverage.join(", ")}.`);
  }

  const extraCoverage = Object.keys(interactionEvidence).filter((id) => !pending.includes(id));
  if (extraCoverage.length) {
    add("errors", interactionAuditFile, 1, `Interaction evidence includes components not marked contractPending: ${extraCoverage.join(", ")}.`);
  }

  for (const id of pending) {
    const contract = behaviorComponents[id];
    if (!contract) continue;
    if (!Array.isArray(contract.docsOnlyUntilPackaged)) {
      add("errors", behaviorFile, 1, `Contract-pending component ${id} must declare docsOnlyUntilPackaged coverage expectations.`);
    }
    if (contract.docsOnlyUntilPackaged.length) {
      add("errors", behaviorFile, 1, `${id} must not leave docs-only behavior pending now that package behavior is remediated.`);
    }

    const evidence = interactionEvidence[id];
    if (evidence === "smoke") {
      const factoryName = kebabToFactoryName(id);
      if (!smokeTest.includes(factoryName)) {
        add("errors", smokeTestFile, 1, `${id} must have smoke evidence through ${factoryName}.`);
      }
      continue;
    }
    if (!interactionAudit.includes(`"${evidence}"`)) {
      add("errors", interactionAuditFile, 1, `${id} must be represented by interaction audit evidence: ${evidence}.`);
    }
  }

  const packagedBehaviorEvidence = {
    chip: ["onSelectedChange", "onRemove"],
    tabs: ["onValueChange", "ArrowRight", "indicatorSynced"],
    tooltip: ["onOpenChange", "Escape"],
    toast: ["onDismiss", "onAction"],
    dialog: ["onOpenChange", "onAction", "Escape"],
    menu: ["onOpenChange", "onSelect", "ArrowDown"],
    drawer: ["onOpenChange", "onAction", "Escape"],
    accordion: ["onExpandedChange", "aria-expanded"],
    table: ["onSortChange", "onRowSelect"],
    slider: ["onValueChange", "pointerdown"],
    "code-input": ["onComplete", "paste", "Backspace"],
    "phone-input": ["onValueChange", "5551234567"],
    "card-number-input": ["onValueChange", "4111111111111112", "luhnValid"],
    "card-expiry-input": ["onValueChange", "1328", "expired"],
    "card-security-code-input": ["onValueChange", "48a2", "complete"],
    "date-picker": ["onValueChange", "onOpenChange", "2026-07-14"],
    "date-range-picker": ["onValueChange", "onOpenChange", "firstInteractiveRangeDate"],
    "segmented-control": ["onValueChange", "ArrowRight"],
    popover: ["onOpenChange", "pointerdown"],
    pagination: ["onPageChange", "aria-current"],
    "tree-view": ["onSelect", "onExpandedChange", "ArrowLeft"],
  };
  for (const [id, requiredSnippets] of Object.entries(packagedBehaviorEvidence)) {
    if (!pending.includes(id)) continue;
    for (const snippet of requiredSnippets) {
      if (!smokeTest.includes(snippet)) {
        add("errors", smokeTestFile, 1, `${id} package-owned behavior must have smoke evidence for ${snippet}.`);
      }
    }
  }
}

function kebabToFactoryName(id) {
  const unprefixedFactoryNames = {
    button: "createButton",
    "icon-button": "createIconButton",
    badge: "createBadge",
    card: "createCard",
    checkbox: "createCheckbox",
    chip: "createChip",
    "empty-state": "createEmptyState",
    "error-panel": "createErrorPanel",
    "floating-action-button": "createFloatingActionButton",
    "inline-validation": "createInlineValidation",
    input: "createInput",
    select: "createSelect",
    "radio-button": "createRadioButton",
    switch: "createSwitch",
    tag: "createTag",
    "text-area": "createTextArea",
    "code-input": "createCodeInput",
    "phone-input": "createPhoneInput",
    "progress-indicator": "createProgressIndicator",
    "card-number-input": "createCardNumberInput",
    "card-expiry-input": "createCardExpiryInput",
    "card-security-code-input": "createCardSecurityCodeInput",
    "date-picker": "createDatePicker",
    skeleton: "createSkeleton",
    avatar: "createAvatar",
    list: "createList",
    "kpi-tile": "createKpiTile",
    "audit-event": "createAuditEvent",
    table: "createTable",
    "chart-panel": "createChartPanel",
    "station-pin": "createStationPin",
    "route-summary": "createRouteSummary",
    "card-summary": "createCardSummary",
    "movement-row": "createMovementRow",
    "quick-action": "createQuickAction",
    tabs: "createTabs",
    accordion: "createAccordion",
    slider: "createSlider",
    "tree-view": "createTreeView",
    "segmented-control": "createSegmentedControl",
    breadcrumbs: "createBreadcrumbs",
    pagination: "createPagination",
    stepper: "createStepper",
    tooltip: "createTooltip",
    toast: "createToast",
    dialog: "createDialog",
    menu: "createMenu",
    drawer: "createDrawer",
    popover: "createPopover",
    "motion-boundary": "createMotionBoundary",
    "animated-moment": "createAnimatedMoment",
    "biometric-prompt": "createBiometricPrompt",
  };
  if (unprefixedFactoryNames[id]) return unprefixedFactoryNames[id];
  return `create${id.split("-").map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join("")}`;
}

module.exports = { checkComponentRemediationCoverage };
