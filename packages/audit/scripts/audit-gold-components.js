const { assertButtonContrast } = require("./audit-css.js");
const { checkGoldComponentCopyContract } = require("./audit-gold-copy.js");
const { checkGoldComponentDocsContract } = require("./audit-gold-docs.js");
const { fs, path, root, catalogFile, docsAppDir, docsAppFile, docsDetailTabsFile, docsDetailTabsModuleFiles, docsFamilyComponentDocsFile, docsGoldComponentDocsFile, docsGoldComponentModuleFiles, docsIconSystemFile, docsInteractionsFile, docsInteractionModuleFiles, docsLayoutFile, componentDocsFile, componentCopyFile, docsCssFile, specFile, cssFile, goldComponents, read, readDocsCss, readJson, readSpec, rel, result, add } = require("./audit-context.js");

function includesAny(text, needles) { return needles.some((needle) => text.includes(needle)); }

function checkGoldComponentTokens() {
  const cssFile = docsCssFile;
  const css = readDocsCss();
  const packageCssFile = path.join(root, "packages/components/styles/components.css");
  const packageCss = fs.existsSync(packageCssFile) ? read(packageCssFile) : "";
  const spec = readSpec();
  const appFile = docsAppFile;
  const app = read(appFile);
  const goldRuntime = [
    app,
    fs.existsSync(docsGoldComponentDocsFile) ? read(docsGoldComponentDocsFile) : "",
    ...docsGoldComponentModuleFiles.map((file) => read(file)),
  ].join("\n");
  const componentsDir = path.join(root, "packages/components/src/components");
  const packageRuntime = fs.existsSync(componentsDir)
    ? fs.readdirSync(componentsDir)
        .filter((file) => file.endsWith(".js"))
        .map((file) => read(path.join(componentsDir, file)))
        .join("\n")
    : "";
  const implementationRuntime = `${goldRuntime}\n${packageRuntime}`;

  for (const component of goldComponents) {
    const tokenCount = (`${css}\n${packageCss}`.match(new RegExp(`--comp-${component}-`, "g")) || []).length;
    const packageRootClass = component === "progress-indicator" ? "progress" : component;
    const packageSelectorCount = (packageCss.match(new RegExp(`\\.${packageRootClass}(?:\\b|_|--)`, "g")) || []).length;
    if (tokenCount < 20 && packageSelectorCount < 2) {
      add("errors", cssFile, 1, `${component} has too few component tokens (${tokenCount}) and no package-owned component anatomy.`);
    }
    const demoFunctionNames = {
      button: "buttonDemo",
      card: "cardDemo",
      checkbox: "checkboxDemo",
      select: "selectDemo",
      combobox: "comboboxDemo",
      "country-selector": "countrySelectorDemo",
      switch: "switchDemo",
      "input": "inputDemo",
      "radio-button": "radioButtonDemo",
      "text-area": "textAreaDemo",
      "icon-button": "iconButtonDemo",
      badge: "badgeDemo",
      chip: "chipDemo",
      tag: "tagDemo",
      tabs: "tabsDemo",
      tooltip: "tooltipDemo",
      toast: "toastDemo",
      "inline-validation": "inlineValidationDemo",
      "progress-indicator": "progressIndicatorDemo",
      spinner: "spinnerDemo",
      skeleton: "skeletonDemo",
      dialog: "dialogDemo", menu: "menuDemo", drawer: "drawerDemo", accordion: "accordionDemo", "empty-state": "emptyStateDemo", table: "tableDemo", avatar: "avatarDemo", slider: "sliderDemo", stepper: "stepperDemo", list: "listDemo", "kpi-tile": "kpiTileDemo", "bottom-sheet": "bottomSheetDemo", "chart-panel": "chartPanelDemo", "station-pin": "stationPinDemo", "route-summary": "routeSummaryDemo", "code-input": "codeInputDemo", "phone-input": "phoneInputDemo", "card-number-input": "cardNumberInputDemo", "card-expiry-input": "cardExpiryInputDemo", "card-security-code-input": "cardSecurityCodeInputDemo", "date-picker": "datePickerDemo", "date-range-picker": "dateRangePickerDemo", "segmented-control": "segmentedControlDemo", popover: "popoverDemo", "floating-action-button": "floatingActionButtonDemo", "card-summary": "cardSummaryDemo", "movement-row": "movementRowDemo", "quick-action": "quickActionDemo", "biometric-prompt": "biometricPromptDemo", "breadcrumbs": "breadcrumbsDemo", "pagination": "paginationDemo", "audit-event": "auditEventDemo", "error-panel": "errorPanelDemo", "tree-view": "treeViewDemo", "motion-boundary": "motionBoundaryDemo", "animated-moment": "animatedMomentDemo",
    };
    if (!goldRuntime.includes(`function ${demoFunctionNames[component]}`)) {
      add("warnings", appFile, 1, `${component} does not expose a named demo helper.`);
    }
  }

  const interactions = [
    fs.existsSync(docsInteractionsFile) ? read(docsInteractionsFile) : "",
    ...docsInteractionModuleFiles.map((file) => read(file)),
  ].join("\n");
  if (!goldRuntime.includes("function buttonPlaygroundPanel") || !interactions.includes("function setupButtonPlaygrounds")) {
    add("errors", appFile, 1, "Button gold standard must include an interactive playground in Build.");
  }

  checkGoldComponentDocsContract();
  checkGoldComponentCopyContract({ app, spec });

  for (const component of goldComponents) {
    if (app.includes(`function ${component}DocumentationTabs`)) {
      add("errors", appFile, 1, `${component} gold documentation tab structure must come from content/component-docs.json, not a component-specific tab function.`);
    }
  }

  if (/componentSectionCopy\(\s*"(?:button|select|card|input)"\s*,\s*"[^"]+"\s*,/.test(app)) {
    add("errors", appFile, 1, "Gold component copy must not use embedded fallback strings in app.js.");
  }

  const iconSystem = fs.existsSync(docsIconSystemFile) ? read(docsIconSystemFile) : "";
  const componentRuntime = `${goldRuntime}\n${iconSystem}`;
  for (const required of ["miel: \"hive\"", "ui(\"miel.title\")", "ui(\"miel.agentCanDecide\")", "ui(\"miel.agentMustAsk\")", "ui(\"miel.rejectIf\")", "ui(\"miel.handoff\")", "ui(\"miel.machineContract\")"]) {
    if (!componentRuntime.includes(required)) {
      add("errors", appFile, 1, `MIEL tab must support human-agent collaboration: ${required}.`);
    }
  }

  const interactionRuntime = [
    fs.existsSync(docsInteractionsFile) ? read(docsInteractionsFile) : "",
    ...docsInteractionModuleFiles.map((file) => read(file)),
  ].join("\n");
  for (const required of ["setupComponentDemoInteractions", "setupComponentPlaygrounds", "setupChoiceDemos", "setupSwitchDemos", "setupRadioButtonDemos", "setupTextAreaDemos", "setupIconButtonDemos", "setupCardDemos"]) {
    if (!interactionRuntime.includes(required)) {
      add("errors", appFile, 1, `Gold demos must use shared interaction support outside playground-only behavior: ${required}.`);
    }
  }

  if (!goldRuntime.includes("function buttonViewportOrganizationPanel")) {
    add("errors", appFile, 1, "Button gold standard must document viewport organization.");
  }

  for (const component of goldComponents) {
    const pascalName = component
      .split("-")
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join("");
    const camelName = pascalName[0].toLowerCase() + pascalName.slice(1);
    const componentRuntime = docsGoldComponentModuleFiles
      .filter((file) => file.includes(`gold-${component}-docs.js`))
      .map((file) => read(file))
      .join("\n");
    const sharedSimpleRuntime = docsGoldComponentModuleFiles
      .filter((file) => file.includes("gold-simple-component-docs.js"))
      .map((file) => read(file))
      .join("\n");
    const operationalPanelPattern = new RegExp(`function ${camelName}OperationalExamplePanel[\\s\\S]*fleet-panel-mini`);
    if (!operationalPanelPattern.test(componentRuntime) && !(componentRuntime.includes("renderSimpleGoldSection") && sharedSimpleRuntime.includes("fleet-panel-mini"))) {
      add("errors", appFile, 1, `${component} operational example must include the shared fleet-panel-mini rationale block.`);
    }
    const accessibilityPanelPattern = new RegExp(`function ${camelName}Accessibility(?:Summary)?Panel[\\s\\S]*icon\\("check_circle",\\s*\\{\\s*tone:\\s*"success",\\s*fill:\\s*true\\s*\\}\\)`);
    if (!accessibilityPanelPattern.test(componentRuntime) && !(componentRuntime.includes("renderSimpleGoldSection") && sharedSimpleRuntime.includes('icon("check_circle", { tone: "success", fill: true })'))) {
      add("errors", appFile, 1, `${component} accessibility checklist icon must use the shared success filled treatment.`);
    }
  }

  if (goldRuntime.includes("button-decision-list")) {
    add("errors", appFile, 1, "Gold operational examples must not use component-specific decision list layouts.");
  }

  for (const legacyFunction of ["selectOptionsPanel", "cardMigrationPanel"]) {
    if (goldRuntime.includes(`function ${legacyFunction}`)) {
      add("errors", appFile, 1, `Legacy unused gold panel must not remain in app.js: ${legacyFunction}.`);
    }
  }

  if (!spec?.artifacts?.patterns?.["select-option-layer"]) {
    add("errors", specFile, 1, "Select grouped option behavior must live as the Select Option Layer pattern contract.");
  }
  const selectOptionLayer = spec?.artifacts?.patterns?.["select-option-layer"];
  for (const field of ["entryConditions", "decisionTree", "componentDependencies", "failureModes", "successMetrics", "agentInstructions", "rejectIf"]) {
    if (!Array.isArray(selectOptionLayer?.[field]) || selectOptionLayer[field].length === 0) {
      add("errors", specFile, 1, `Select Option Layer pattern contract missing ${field}.`);
    }
  }
  const catalog = readJson(catalogFile);
  const hasSelectOptionLayer = (catalog?.patterns ?? []).some((entry) => entry.title === "Select Option Layer");
  if (!hasSelectOptionLayer) {
    add("errors", catalogFile, 1, "Select Option Layer pattern contract must be reachable from the rendered pattern inventory.");
  }
  const patternRuntime = [
    app,
    fs.existsSync(docsDetailTabsFile) ? read(docsDetailTabsFile) : "",
    ...docsDetailTabsModuleFiles.map((file) => read(file)),
    fs.existsSync(docsFamilyComponentDocsFile) ? read(docsFamilyComponentDocsFile) : "",
  ].join("\n");
  for (const rendererGuard of ["contract?.componentDependencies ?? entry.componentsUsed", "contract?.successMetrics ??", "contract?.agentInstructions", "contract?.rejectIf", "contract.failureModes?.join", "contract.rejectIf", "contract?.governingFoundations", "tokenDependencies: contract.tokenDependencies", "primitiveDependencies: contract.primitiveDependencies"]) {
    if (!patternRuntime.includes(rendererGuard)) {
      add("errors", appFile, 1, `Pattern pages must render contract data instead of generic copy: ${rendererGuard}.`);
    }
  }
  if (!/function agentPanel[\s\S]*componentAgentSpec\(entry, layerName\)/.test(patternRuntime)) {
    add("errors", appFile, 1, "MIEL agent panel must reuse the shared artifact agent spec builder.");
  }
  const cardMigrationDecision = spec?.referencePolicy?.decisions?.some((decision) => decision.area === "Card benchmark migration notes" && decision.decision === "Adapt");
  if (!cardMigrationDecision) {
    add("errors", specFile, 1, "Card ZIP migration notes must live in referencePolicy.");
  }

  const copyText = JSON.stringify(readJson(componentCopyFile) ?? {});
  const specText = JSON.stringify(readJson(specFile) ?? {});
  const buttonRuleSource = `${copyText}\n${specText}`;
  if (!copyText.includes('"live":true')) {
    add("errors", componentCopyFile, 1, "Badge documentation must include a live status example so benchmark pulse motion is visible and testable.");
  }
  if (!buttonRuleSource.includes("primary is action-primary blue") || !buttonRuleSource.includes("outlined is white with neutral 200 outline")) {
    add("errors", componentCopyFile, 1, "Button variants must keep the primary/secondary/outlined color rule available for audit.");
  }

  for (const selector of [".button-playground", ".viewport-doc-grid"]) {
    if (!css.includes(selector)) {
      add("errors", cssFile, 1, `Missing Button documentation style selector ${selector}.`);
    }
  }

  if (!goldRuntime.includes('data-density-context="${group.density}"')) {
    add("errors", appFile, 1, "Button viewport examples must apply their responsive context.");
  }

  if (goldRuntime.includes('buttonPlaygroundSelect("Size"') || goldRuntime.includes('data-button-playground-input="size"')) {
    add("errors", appFile, 1, "Button playground must not expose public Size; scale is owned by Density.");
  }

  for (const token of ["--button-default-height", "--button-default-padding-x", "--button-default-font-size", "--button-default-gap", "--button-default-icon-size"]) {
    if (!css.includes(token)) {
      add("errors", cssFile, 1, `Button must expose density-derived default token: ${token}.`);
    }
  }

  for (const token of [
    "--density-doc-heading-size",
    "--density-doc-body-size",
    "--density-doc-label-size",
    "--density-doc-card-title-size",
    "--density-doc-card-body-size",
    "--density-doc-card-min-block",
    "--density-doc-example-min-block",
  ]) {
    if (!css.includes(token)) {
      add("errors", cssFile, 1, `Density documentation contract missing token: ${token}.`);
    }
  }

  const documentationContract = [
    [/:is\(\.detail-page,\s*\.reference-doc\)\s+\.doc-panel\s*{[^}]*padding:\s*var\(--density-surface-padding\);/s, "Documentation panels must use Density surface padding globally."],
    [/:is\(\.detail-page,\s*\.reference-doc\)\s+\.reference-section-block\s*{[^}]*padding:\s*var\(--density-surface-padding\);/s, "Foundation and primitive reference sections must use Density surface padding."],
    [/:is\(\.detail-page,\s*\.reference-doc\)\s+\.doc-panel\s*>\s*h2,[\s\S]*?font-size:\s*var\(--density-doc-heading-size\);/s, "Documentation headings must use Density/Voice heading scale globally."],
    [/:is\(\.detail-page,\s*\.reference-doc\)\s+\.doc-panel\s*>\s*p,[\s\S]*?font-size:\s*var\(--density-doc-body-size\);/s, "Documentation paragraphs must use Density/Voice body scale globally."],
    [/:is\(\.detail-page,\s*\.reference-doc\)\s+\.button-scenario,[\s\S]*?\.select-scenario,[\s\S]*?gap:\s*var\(--density-component-gap-lg\);/s, "Component documentation scenarios must share Density large component gap."],
    [/:is\(\.detail-page,\s*\.reference-doc\)\s+\.button-principles article,[\s\S]*?\.filter-console,[\s\S]*?padding:\s*var\(--density-card-padding\);/s, "Documentation cards and examples must use Density card padding."],
    [/:is\(\.detail-page,\s*\.reference-doc\)\s+\.button-operational-panel\s+\.driver-sheet,[\s\S]*?\.select-scenario\s+\.filter-console,[\s\S]*?min-block-size:\s*var\(--density-doc-example-min-block\);/s, "Operational examples must use Density example height across Button and Select."],
    [/:is\(\.detail-page,\s*\.reference-doc\)\s+\.foundation-explorer,[\s\S]*?\.primitive-demo,[\s\S]*?min-block-size:\s*var\(--density-doc-example-min-block\);/s, "Foundation and primitive demos must use the shared documentation contract."],
  ];
  for (const [pattern, message] of documentationContract) {
    if (!pattern.test(css)) add("errors", cssFile, 1, message);
  }

  if (/buttonPlaygroundSelect\("Size"/.test(goldRuntime) || /buttonDemo\([^)]*"xl"/.test(goldRuntime) || /data-size=/.test(goldRuntime)) {
    add("errors", appFile, 1, "Button documentation must not expose public size or data-size.");
  }

  if (/\.button\[data-size=/.test(css)) {
    add("errors", cssFile, 1, "Button CSS must not expose data-size selectors.");
  }

  if (goldRuntime.includes("selectSizesPanel") || /select--(?:sm|md|lg)/.test(goldRuntime) || /function selectDemo\([^)]*size/.test(goldRuntime)) {
    add("errors", appFile, 1, "Select documentation must not expose public size; scale is owned by Density.");
  }

  if (/\.select--(?:sm|md|lg)/.test(css)) {
    add("errors", cssFile, 1, "Select CSS must not expose public size classes.");
  }

  const badgeChipTabsVisualContract = [
    ["--comp-badge-bg-danger: color-mix", "Badge must use subtle semantic surfaces translated from the ZIP benchmark, not solid fills."],
    [".chip[data-selected=\"true\"]", "Chip selected state must be owned by the package root."],
    ["color: var(--sys-color-action-text)", "Chip selected state must preserve high-contrast inverse text through Design System action text."],
    ["--comp-chip-padding-inline: var(--sys-frame-padding-control)", "Chip horizontal padding must resolve from Frame control padding instead of shared Badge/Tag padding."],
    ["--comp-chip-gap: var(--sys-space-xs)", "Chip internal gap must use compact spacing instead of the larger component gap."],
    [".chip[data-chip-remove=\"true\"]", "Removable Chip must own extra inline-end padding through the package root."],
    ["--comp-tabs-bg: var(--sys-energy-surface-sunken)", "Tabs default variant must use a sunken pill group surface."],
    ["--comp-tabs-tab-bg-selected: var(--sys-energy-surface-primary)", "Tabs selected state must use raised surface treatment, not a filled action button."],
    ["--comp-chip-hover-transform: scale(var(--sys-momentum-scale-hover))", "Chip hover motion must use Package component motion in the package."],
    ["button.chip:active:not(:disabled)", "Chip press motion must be owned by the package button state."],
    ["--comp-tag-bg-neutral: var(--sys-energy-surface-sunken)", "Tag must use subtle metadata surfaces instead of action styling."],
    ["--comp-tag-hover-transform: scale(var(--sys-momentum-scale-hover))", "Interactive Tag hover motion must use valid spring scale from Momentum tokens."],
    ["--comp-tag-press-transform: scale(var(--sys-momentum-scale-press))", "Interactive Tag press motion must use valid press scale from Momentum tokens."],
    ["--comp-tabs-indicator-transition: left var(--sys-momentum-duration-default) var(--sys-momentum-easing-touch), width var(--sys-momentum-duration-default) var(--sys-momentum-easing-touch)", "Tabs must move a benchmark-style active indicator with left/width spring motion."],
    [".tabs-demo::before", "Tabs must render a moving active indicator instead of styling the selected tab as a static button."],
    ["--comp-tooltip-bubble-bg: var(--sys-energy-text-primary)", "Tooltip bubble must use a high-contrast layer surface from Design System Energy."],
    ["--comp-tooltip-transition: opacity var(--sys-momentum-duration-fast) var(--sys-momentum-easing-touch), transform var(--sys-momentum-duration-fast) var(--sys-momentum-easing-touch)", "Tooltip motion must use ZIP-like scale with Design System Momentum."],
    ["--comp-toast-shadow: var(--sys-depth-elevation-3)", "Toast must use Depth as a floating feedback layer."],
    ["--comp-toast-transition: opacity var(--sys-momentum-duration-fast) var(--sys-momentum-easing-touch), transform var(--sys-momentum-duration-fast) var(--sys-momentum-easing-touch), box-shadow var(--sys-momentum-duration-fast) var(--sys-momentum-easing-touch)", "Toast lifecycle motion must use Design System Momentum."],
    ["--comp-inline-validation-danger: var(--sys-energy-status-error)", "Inline Validation error state must use Design System Energy danger semantics."],
    ["--progress-tone: var(--sys-color-action)", "Progress Indicator active fill must use Design System action primary through the package token bridge."],
    ["inline-size var(--component-duration-slow) var(--component-ease-state)", "Progress Indicator determinate motion must follow the ZIP timing through package Momentum aliases."],
    ["--comp-skeleton-bg: var(--sys-energy-surface-sunken)", "Skeleton must use Design System Energy surfaces, not raw gray fills."],
    ["--comp-skeleton-gradient: linear-gradient(90deg, var(--comp-skeleton-bg) 25%, var(--comp-skeleton-highlight) 50%, var(--comp-skeleton-bg) 75%)", "Skeleton shimmer must follow the ZIP surface-sunken to border-subtle gradient model."],
    ["--comp-skeleton-shimmer-duration: var(--component-duration-shimmer)", "Skeleton shimmer must use the package loading duration role instead of a raw ref token."],
    ["@media (prefers-reduced-motion: reduce)", "Badge, Chip, Tag, and Tabs motion must include a reduced-motion path."],
    ["simple-viewport-demo", "Badge, Chip, Tag, and Tabs viewport examples must use their own compact viewport container, not Button phone demos."],
  ];
  const componentCss = `${css}\n${packageCss}`;
  for (const [required, message] of badgeChipTabsVisualContract) if (!componentCss.includes(required)) add("errors", cssFile, 1, message);
  if (!packageCss.includes(".skeleton") || !packageCss.includes("--skeleton-width: var(--comp-skeleton-width);")) {
    add("errors", packageCssFile, 1, "Skeleton package-backed demos must style the Package component root, not only the legacy skeleton-demo fallback.");
  }
  const packageSemanticChecks = [
    [["role=\"tooltip\"", "setAttribute(\"role\", \"tooltip\")"], "Tooltip demos must expose tooltip semantics."],
    [["role=\"${role}\"", "setAttribute(\"role\", role)"], "Toast demos must expose live-region semantics."],
    [["aria-live=\"${role === \"alert\" ? \"assertive\" : \"polite\"}\"", "setAttribute(\"aria-live\", role === \"alert\" ? \"assertive\" : \"polite\")"], "Toast demos must expose live-region semantics."],
    [["aria-describedby=", "setAttribute(\"aria-describedby\""], "Inline Validation demos must expose field-message association and invalid state semantics."],
    [["aria-invalid"], "Inline Validation demos must expose field-message association and invalid state semantics."],
    [["role=\"progressbar\"", "setAttribute(\"role\", \"progressbar\")"], "Progress Indicator demos must expose progressbar semantics and determinate values."],
    [["aria-valuenow"], "Progress Indicator demos must expose progressbar semantics and determinate values."],
    [["skeleton-demo__surface", "skeleton__bone"], "Skeleton demos must render decorative bones hidden from assistive technology."],
    [["aria-hidden=\"true\"", "setAttribute(\"aria-hidden\", \"true\")"], "Skeleton demos must render decorative bones hidden from assistive technology."],
    [["aria-busy"], "Skeleton demos must render decorative bones hidden from assistive technology."],
  ];
  for (const [needles, message] of packageSemanticChecks) if (!includesAny(implementationRuntime, needles)) add("errors", appFile, 1, message);
  const simpleRendererRuntime = docsGoldComponentModuleFiles
    .filter((file) => file.includes("gold-simple-component-docs.js"))
    .map((file) => read(file))
    .join("\n");
  if (simpleRendererRuntime.includes("viewport-phone-demo")) {
    add("errors", appFile, 1, "Simple component viewport organization must not reuse Button viewport-phone-demo.");
  }
  if (css.includes("--sys-frame-radius-pill")) {
    add("errors", cssFile, 1, "Component CSS must use Design System radius tokens that exist; use --sys-frame-radius-full for pill geometry.");
  }
  const layoutText = fs.existsSync(docsLayoutFile) ? read(docsLayoutFile) : "";
  if (!layoutText.includes("content-shell density-responsive")) {
    add("errors", docsLayoutFile, 1, "Documentation shell must apply responsive Density context.");
  }
  for (const required of ['class="detail-tabs tabs-demo"', 'data-variant="default"', 'role="tablist"', 'role="tab"', 'aria-selected=', 'tabindex=']) {
    if (!layoutText.includes(required)) {
      add("errors", docsLayoutFile, 1, `Documentation detail tabs must dogfood the Tabs component contract: ${required}.`);
    }
  }
  for (const required of ['class="tag detail-meta-tag"', 'data-variant="metadata"', 'data-variant="platform"', 'data-tone="neutral"']) {
    if (!layoutText.includes(required)) add("errors", docsLayoutFile, 1, `Documentation artifact metadata must dogfood the Tag component contract: ${required}.`);
  }
  if (layoutText.includes("tag-demo")) add("errors", docsLayoutFile, 1, "Documentation artifact metadata must not use the legacy tag-demo implementation.");
  const goldCoreFile = path.join(docsAppDir, "gold-component-core.js");
  const goldCoreText = fs.existsSync(goldCoreFile) ? read(goldCoreFile) : "";
  if (!goldCoreText.includes('class="demo-cell" data-density-context="md"')) {
    add("errors", goldCoreFile, 1, "Component demo cells must cut page-level density to md unless a demo explicitly sets density.");
  }

  if (!css.includes(".density-responsive") || !css.includes("@media (min-width: 576px) and (max-width: 1439px)")) {
    add("errors", cssFile, 1, "Shared Density documentation styles are missing.");
  }
  if (!css.includes("@media (max-width: 575px)") || !/--density-surface-padding:\s*var\(--ref-frame-space-5\);/.test(css)) {
    add("errors", cssFile, 1, "Responsive documentation Density must define a mobile viewport contract, not inherit desktop padding.");
  }

  for (const density of ["sm", "md", "lg"]) {
    if (!packageCss.includes(`.button[data-density="${density}"]`)) {
      add("errors", packageCssFile, 1, `Button CSS missing density selector: ${density}.`);
    }
  }

  if (!/\.button__icon\s*{[^}]*font-size:\s*var\(--button-current-icon-size,\s*var\(--button-icon-size-md\)\);/s.test(packageCss)) {
    add("errors", packageCssFile, 1, "Button icons must inherit Button density and currentColor from the label.");
  }

  const buttonCss = `${css}\n${packageCss}`;
  const ruleBody = (selector) => packageCss.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`, "s"))?.[1] ?? "";
  const primaryBody = ruleBody(".button--primary");
  const primaryHoverBody = ruleBody(".button--primary:hover:not(:disabled)");
  const secondaryBody = ruleBody(".button--secondary");
  const outlinedBody = ruleBody(".button--outlined");
  const dangerBody = ruleBody(".button--danger");
  const warningBody = ruleBody(".button--warning");
  if (secondaryBody.includes("background: var(--sys-color-surface)") && outlinedBody.includes("background: var(--sys-color-surface)")) {
    result.info.push({ file: rel(cssFile), line: 1, message: "Secondary and outlined Button intentionally share white background." });
  }
  if (!primaryBody.includes("background: var(--sys-color-action)") || !primaryBody.includes("color: var(--sys-color-action-text)")) {
    add("errors", packageCssFile, 1, "Primary Button must use the semantic action surface and action text tokens.");
  }
  if (!primaryHoverBody.includes("background: var(--sys-color-action-hover)")) {
    add("errors", packageCssFile, 1, "Primary Button hover must use the semantic action hover token.");
  }
  if (!secondaryBody.includes("background: var(--sys-color-surface)") || !outlinedBody.includes("background: var(--sys-color-surface)")) {
    add("errors", packageCssFile, 1, "Secondary and outlined Button must both use the semantic surface token.");
  }
  if (!secondaryBody.includes("border-color: var(--sys-color-text)") || !secondaryBody.includes("color: var(--sys-color-text)")) {
    add("errors", packageCssFile, 1, "Secondary Button must use semantic text for text and outline.");
  }
  if (!outlinedBody.includes("border-color: var(--sys-color-border)") || !outlinedBody.includes("color: var(--sys-color-text)")) {
    add("errors", packageCssFile, 1, "Outlined Button must use semantic border and text tokens.");
  }
  if (!dangerBody.includes("background: var(--sys-color-danger)") || !dangerBody.includes("color: var(--sys-color-action-text)")) {
    add("errors", packageCssFile, 1, "Danger Button must use the semantic danger surface and action text tokens.");
  }
  if (!warningBody.includes("background: var(--sys-color-warning)") || !warningBody.includes("color: var(--sys-color-action-text)")) {
    add("errors", packageCssFile, 1, "Warning Button must use the semantic warning surface and action text tokens.");
  }
  [
    ["--sys-color-action", "--sys-color-action-text", "Primary Button default"],
    ["--sys-color-action-hover", "--sys-color-action-text", "Primary Button hover"],
    ["--sys-color-surface", "--sys-color-text", "Secondary Button default"],
    ["--sys-color-surface", "--sys-color-text", "Outlined Button default"],
    ["--sys-color-danger", "--sys-color-action-text", "Danger Button default"],
    ["--sys-color-warning", "--sys-color-action-text", "Warning Button default"],
  ].forEach(([background, foreground, label]) => assertButtonContrast(buttonCss, background, foreground, label));
}
module.exports = { checkGoldComponentTokens };
