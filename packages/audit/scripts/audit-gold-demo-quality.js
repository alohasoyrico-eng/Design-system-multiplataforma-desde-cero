const {
  add,
  componentCopyFile,
  docsAppDir,
  goldComponents,
  path,
  root,
  readJson,
  read,
  readSpec,
} = require("./audit-context.js");

const placeholderValues = new Set(["Label", "Value", "Helper", "Description", "Title", "Role", "State", "Default card", "Interactive card", "Selected card", "Muted card"]);

const componentContracts = {
  button: {
    playgroundTag: "<Button",
    operationalItems: (section) => section?.scenario?.sheet?.actions ?? [],
    variantItems: (section) => (section?.demos ?? []).map((demo) => demo.button ?? demo),
    stateItems: (section) => (section?.demos ?? []).map((demo) => demo.button ?? demo),
    displayKeys: ["label"],
    minOperational: 2,
    minVariants: 5,
    minStates: 6,
  },
  select: {
    playgroundTag: "<Select",
    operationalItems: (section) => section?.scenario?.console?.fields ?? [],
    variantItems: (section) => section?.demos ?? [],
    stateItems: (section) => section?.demos ?? [],
    displayKeys: ["field", "value", "helper"],
    minOperational: 3,
    minVariants: 4,
    minStates: 6,
  },
  card: {
    playgroundTag: "<Card",
    operationalItems: (section) => section?.scenario?.cards ?? [],
    variantItems: (section) => section?.demos ?? [],
    stateItems: (section) => section?.demos ?? [],
    displayKeys: ["title", "value", "detail"],
    minOperational: 3,
    minVariants: 4,
    minStates: 6,
  },
  "input": {
    playgroundTag: "<Input",
    operationalItems: (section) => section?.scenario?.fields ?? [],
    variantItems: (section) => section?.demos ?? [],
    stateItems: (section) => section?.demos ?? [],
    displayKeys: ["field", "value", "placeholder", "helper"],
    minOperational: 3,
    minVariants: 4,
    minStates: 6,
  },
  checkbox: {
    playgroundTag: "<Checkbox",
    operationalItems: (section) => section?.scenario?.items ?? [],
    variantItems: (section) => section?.demos ?? [],
    stateItems: (section) => section?.demos ?? [],
    displayKeys: ["label", "description"],
    minOperational: 3,
    minVariants: 4,
    minStates: 6,
  },
  switch: {
    playgroundTag: "<Switch",
    operationalItems: (section) => section?.scenario?.items ?? [],
    variantItems: (section) => section?.demos ?? [],
    stateItems: (section) => section?.demos ?? [],
    displayKeys: ["label", "description"],
    minOperational: 3,
    minVariants: 4,
    minStates: 6,
  },
  "radio-button": {
    playgroundTag: "<RadioButton",
    operationalItems: (section) => section?.scenario?.items ?? [],
    variantItems: (section) => section?.demos ?? [],
    stateItems: (section) => section?.demos ?? [],
    displayKeys: ["label", "description"],
    minOperational: 3,
    minVariants: 4,
    minStates: 5,
  },
  "text-area": {
    playgroundTag: "<TextArea",
    operationalItems: (section) => section?.scenario?.fields ?? [],
    variantItems: (section) => section?.demos ?? [],
    stateItems: (section) => section?.demos ?? [],
    displayKeys: ["field", "value", "placeholder", "helper"],
    minOperational: 3,
    minVariants: 4,
    minStates: 6,
  },
  "icon-button": {
    playgroundTag: "<IconButton",
    operationalItems: (section) => section?.scenario?.items ?? [],
    variantItems: (section) => section?.demos ?? [],
    stateItems: (section) => section?.demos ?? [],
    displayKeys: ["ariaLabel", "icon"],
    minOperational: 3,
    minVariants: 4,
    minStates: 6,
  },
  badge: {
    playgroundTag: "<Badge",
    operationalItems: (section) => section?.scenario?.items ?? [],
    variantItems: (section) => section?.demos ?? [],
    stateItems: (section) => section?.demos ?? [],
    displayKeys: ["label", "ariaLabel"],
    minOperational: 3,
    minVariants: 4,
    minStates: 6,
  },
  chip: {
    playgroundTag: "<Chip",
    operationalItems: (section) => section?.scenario?.items ?? [],
    variantItems: (section) => section?.demos ?? [],
    stateItems: (section) => section?.demos ?? [],
    displayKeys: ["label"],
    minOperational: 3,
    minVariants: 4,
    minStates: 6,
  },
  tag: {
    playgroundTag: "<Tag",
    operationalItems: (section) => section?.scenario?.items ?? [],
    variantItems: (section) => section?.demos ?? [],
    stateItems: (section) => section?.demos ?? [],
    displayKeys: ["label"],
    minOperational: 3,
    minVariants: 4,
    minStates: 5,
  },
  tabs: {
    playgroundTag: "<Tabs",
    operationalItems: (section) => section?.scenario?.items ?? [],
    variantItems: (section) => section?.demos ?? [],
    stateItems: (section) => section?.demos ?? [],
    displayKeys: ["ariaLabel", "label"],
    minOperational: 3,
    minVariants: 4,
    minStates: 6,
  },
  tooltip: { playgroundTag: "<Tooltip", operationalItems: (section) => section?.scenario?.items ?? [], variantItems: (section) => section?.demos ?? [], stateItems: (section) => section?.demos ?? [], displayKeys: ["label", "trigger"], minOperational: 3, minVariants: 4, minStates: 6 },
  toast: { playgroundTag: "<Toast", operationalItems: (section) => section?.scenario?.items ?? [], variantItems: (section) => section?.demos ?? [], stateItems: (section) => section?.demos ?? [], displayKeys: ["label", "description"], minOperational: 3, minVariants: 5, minStates: 6 },
  "inline-validation": { playgroundTag: "<InlineValidation", operationalItems: (section) => section?.scenario?.items ?? [], variantItems: (section) => section?.demos ?? [], stateItems: (section) => section?.demos ?? [], displayKeys: ["label", "message"], minOperational: 3, minVariants: 4, minStates: 6 },
  "progress-indicator": { playgroundTag: "<ProgressIndicator", operationalItems: (section) => section?.scenario?.items ?? [], variantItems: (section) => section?.demos ?? [], stateItems: (section) => section?.demos ?? [], displayKeys: ["label"], minOperational: 3, minVariants: 4, minStates: 6 },
  skeleton: { playgroundTag: "<Skeleton", operationalItems: (section) => section?.scenario?.items ?? [], variantItems: (section) => section?.demos ?? [], stateItems: (section) => section?.demos ?? [], displayKeys: ["label"], minOperational: 3, minVariants: 5, minStates: 6 },
  dialog: { playgroundTag: "<Dialog", operationalItems: (section) => section?.scenario?.items ?? [], variantItems: (section) => section?.demos ?? [], stateItems: (section) => section?.demos ?? [], displayKeys: ["label", "description"], minOperational: 3, minVariants: 5, minStates: 6 },
  menu: { playgroundTag: "<Menu", operationalItems: (section) => section?.scenario?.items ?? [], variantItems: (section) => section?.demos ?? [], stateItems: (section) => section?.demos ?? [], displayKeys: ["trigger", "label"], minOperational: 3, minVariants: 5, minStates: 6 },
  drawer: { playgroundTag: "<Drawer", operationalItems: (section) => section?.scenario?.items ?? [], variantItems: (section) => section?.demos ?? [], stateItems: (section) => section?.demos ?? [], displayKeys: ["label", "description"], minOperational: 3, minVariants: 5, minStates: 6 },
  accordion: { playgroundTag: "<Accordion", operationalItems: (section) => section?.scenario?.items ?? [], variantItems: (section) => section?.demos ?? [], stateItems: (section) => section?.demos ?? [], displayKeys: ["label", "description"], minOperational: 3, minVariants: 5, minStates: 6 },
  "empty-state": { playgroundTag: "<EmptyState", operationalItems: (section) => section?.scenario?.items ?? [], variantItems: (section) => section?.demos ?? [], stateItems: (section) => section?.demos ?? [], displayKeys: ["label", "description"], minOperational: 3, minVariants: 5, minStates: 6 },
  table: { playgroundTag: "<Table", operationalItems: (section) => section?.scenario?.items ?? [], variantItems: (section) => section?.demos ?? [], stateItems: (section) => section?.demos ?? [], displayKeys: ["label"], minOperational: 3, minVariants: 5, minStates: 6 },
  avatar: { playgroundTag: "<Avatar", operationalItems: (section) => section?.scenario?.items ?? [], variantItems: (section) => section?.demos ?? [], stateItems: (section) => section?.demos ?? [], displayKeys: ["label", "name"], minOperational: 3, minVariants: 5, minStates: 6 },
  slider: { playgroundTag: "<Slider", operationalItems: (section) => section?.scenario?.items ?? [], variantItems: (section) => section?.demos ?? [], stateItems: (section) => section?.demos ?? [], displayKeys: ["label", "valueLabel"], minOperational: 3, minVariants: 5, minStates: 6 },
  stepper: { playgroundTag: "<Stepper", operationalItems: (section) => section?.scenario?.items ?? [], variantItems: (section) => section?.demos ?? [], stateItems: (section) => section?.demos ?? [], displayKeys: ["label"], minOperational: 3, minVariants: 4, minStates: 3 },
};

function isEmpty(value) {
  return value == null || String(value).trim() === "";
}

function isPlaceholder(value) {
  if (isEmpty(value)) return false;
  return placeholderValues.has(String(value).trim());
}

function walkValues(value, path = "") {
  if (Array.isArray(value)) return value.flatMap((item, index) => walkValues(item, `${path}[${index}]`));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([key, item]) => walkValues(item, path ? `${path}.${key}` : key));
  return [{ path, value }];
}

function checkDisplayValues(component, sectionName, items, keys) {
  for (const [index, item] of items.entries()) {
    if ("label" in (item ?? {}) && isEmpty(item.label)) {
      add("errors", componentCopyFile, 1, `${component} ${sectionName} demo ${index + 1} must not render an empty visible label.`);
    }
    if (item?.variant === "dot" && isEmpty(item.label)) {
      add("errors", componentCopyFile, 1, `${component} ${sectionName} dot demo ${index + 1} needs visible documentation text; dot-only markers are not self-documenting.`);
    }
    if (item?.state === "hidden" && isEmpty(item.label)) {
      add("errors", componentCopyFile, 1, `${component} ${sectionName} hidden demo ${index + 1} needs a visible documentation sample instead of an empty cell.`);
    }
    const values = keys.map((key) => item?.[key]).filter((value) => !isEmpty(value));
    if (!values.length) {
      add("errors", componentCopyFile, 1, `${component} ${sectionName} demo ${index + 1} must include visible product copy.`);
      continue;
    }
    for (const key of keys) {
      if (isPlaceholder(item?.[key])) {
        add("errors", componentCopyFile, 1, `${component} ${sectionName} demo ${index + 1} uses placeholder ${key}: ${item[key]}.`);
      }
    }
  }
}

function normalizedDependencyCandidates(dependency) {
  const clean = String(dependency).replace(/\.\*$/, ".");
  const aliases = new Set([dependency, clean]);
  if (clean === "sys.a11y.") aliases.add("sys.accessibility.");
  if (clean === "sys.accessibility.") aliases.add("sys.a11y.");
  return [...aliases];
}

function checkFoundationCoverage(component, copy, specComponent) {
  const foundations = Object.keys(specComponent?.foundations ?? {});
  if (foundations.length < 11) {
    add("errors", componentCopyFile, 1, `${component} spec foundation coverage must include all Design System foundations before documentation scales.`);
  }
  const copyText = JSON.stringify(copy ?? {});
  for (const dependency of specComponent?.tokenDependencies ?? []) {
    const candidates = normalizedDependencyCandidates(dependency);
    if (!candidates.some((candidate) => copyText.includes(candidate))) {
      add("errors", componentCopyFile, 1, `${component} documentation must expose token dependency ${dependency} in Anatomy or API and foundations.`);
    }
  }
  const anatomyTokens = (copy?.anatomy?.items ?? []).flatMap((item) => item.tokens ?? []);
  if (!anatomyTokens.some((token) => /^sys\.voice\./.test(token))) {
    add("errors", componentCopyFile, 1, `${component} anatomy must expose Voice usage.`);
  }
  if (!anatomyTokens.some((token) => /^sys\.(state|accessibility|a11y)\./.test(token)) && foundations.includes("State")) {
    add("errors", componentCopyFile, 1, `${component} anatomy must expose State or Accessibility usage.`);
  }
}

function checkPlayground(component, playground, contract) {
  const controls = playground?.controls ?? [];
  const preview = playground?.preview;
  const snippet = playground?.snippet ?? "";

  if (controls.length < 4) {
    add("errors", componentCopyFile, 1, `${component} playground must expose enough controls to explain the component contract.`);
  }
  for (const control of controls) {
    if (isPlaceholder(control?.value)) {
      add("errors", componentCopyFile, 1, `${component} playground control ${control.name} uses placeholder value: ${control.value}.`);
    }
    if (control?.type === "select" && (control.options?.length ?? 0) < 2) {
      add("errors", componentCopyFile, 1, `${component} playground select control ${control.name} must include real options.`);
    }
  }
  if (!preview || typeof preview !== "object") {
    add("errors", componentCopyFile, 1, `${component} playground must include a preview object.`);
  } else {
    checkDisplayValues(component, "playground preview", [preview], contract.displayKeys);
  }
  if (!snippet.includes(contract.playgroundTag)) {
    add("errors", componentCopyFile, 1, `${component} playground snippet must show the component API tag ${contract.playgroundTag}.`);
  }
}

function collectSectionItems(copy, contract) {
  return [
    ...contract.operationalItems(copy["operational-example"]),
    ...contract.variantItems(copy.variants),
    ...contract.stateItems(copy.states),
    ...((copy["responsive-layout-patterns"]?.examples ?? []).flatMap((example) => example.demos ?? [])),
    ...((copy["full-width"]?.items ?? []).flatMap((item) => item.demos ?? [item.demo]).filter(Boolean)),
    ...((copy["viewport-organization"]?.items ?? []).map((item) => item.demo).filter(Boolean)),
    copy.playground?.preview,
  ].filter(Boolean);
}

function checkComponentSpecificDemoQuality(component, copy, contract) {
  const items = collectSectionItems(copy, contract);
  if (component === "text-area") {
    const counted = items.filter((item) => Number.isFinite(Number(item.maxLength)));
    if (counted.length < 4) {
      add("errors", componentCopyFile, 1, "text-area demos must prove character counter behavior across overview, design, and playground.");
    }
    for (const item of counted) {
      if (String(item.value ?? "").length > Number(item.maxLength)) {
        add("errors", componentCopyFile, 1, `text-area demo ${item.field ?? item.label ?? "unnamed"} exceeds maxLength.`);
      }
    }
  }
  if (component === "icon-button") {
    const visibleSearchDemo = items.some((item) => /search|busqueda|búsqueda/i.test(`${item.icon ?? ""} ${item.ariaLabel ?? ""}`));
    if (visibleSearchDemo) {
      add("errors", componentCopyFile, 1, "icon-button visible demos must not use search; search is an input pattern.");
    }
    const playgroundOptions = copy.playground?.controls?.find((control) => control.name === "icon")?.options ?? [];
    for (const required of ["language", "grid_view", "contrast"]) {
      if (!playgroundOptions.includes(required)) {
        add("errors", componentCopyFile, 1, `icon-button playground must include topbar utility icon option: ${required}.`);
      }
    }
  }
  if (component === "chip") {
    const chipComponentFile = path.join(root, "packages/components/src/components/status.js");
    const interactionsFile = path.join(docsAppDir, "stateful-component-interactions.js");
    const chipComponent = read(chipComponentFile);
    const interactions = read(interactionsFile);
    if (chipComponent.includes('role="button"') || chipComponent.includes('tabindex="0"')) {
      add("errors", chipComponentFile, 1, "Chip remove affordance must use a native button, not role=button/tabindex shims.");
    }
    if (!chipComponent.includes('document.createElement(interactive ? "button" : "span")') || !chipComponent.includes("dataset.chipRemove")) {
      add("errors", chipComponentFile, 1, "Chip removable package implementation must render a native removable button with the data-chip-remove hook.");
    }
    if (!chipComponent.includes("onRemove") || !chipComponent.includes("onSelectedChange")) add("errors", chipComponentFile, 1, "Chip package behavior must expose remove and selected-change callbacks.");
    if (!interactions.includes("[data-chip-remove]")) {
      add("errors", interactionsFile, 1, "Chip interactions must bind removable behavior through the package data-chip-remove hook.");
    }
    if (interactions.includes('.tabs-demo:not(.detail-tabs):not([data-demo-ready=')) {
      add("errors", interactionsFile, 1, "Tabs interactions must include the documentation tab bar so it uses the same indicator and motion contract.");
    }
  }
  if (component === "tabs") {
    const tabsCssFile = path.join(docsAppDir, "styles", "04m-tabs-docs.css");
    const tabsCss = read(tabsCssFile);
    const allowedVariants = new Set(["default", "underline"]);
    const unsupportedVariants = items.filter((item) => item.variant && !allowedVariants.has(item.variant));
    if (unsupportedVariants.length) {
      add("errors", componentCopyFile, 1, "tabs documentation supports only default and underline variants; contained/scrollable need a separate contract decision.");
    }
    const playgroundOptions = copy.playground?.controls?.find((control) => control.name === "variant")?.options ?? [];
    if (playgroundOptions.join("|") !== "default|underline") {
      add("errors", componentCopyFile, 1, "tabs playground must expose exactly the approved default and underline variants.");
    }
    if (!tabsCss.includes("--comp-tabs-focus-offset: var(--sys-a11y-focus-offset);")) {
      add("errors", tabsCssFile, 1, "Tabs focus ring must sit outside the pill enough to avoid being masked by the track.");
    }
    if (!/\.tabs-demo \[role="tab"\]:focus,\s*\.tabs-demo \[role="tab"\]:focus-visible,\s*\.tabs-demo\[data-state="focus"\] \[role="tab"\]\[aria-selected="true"\]\s*\{[^}]*z-index:\s*var\(--sys-depth-z-floating\);[^}]*outline:\s*var\(--comp-tabs-focus-ring\);/s.test(tabsCss)) {
      add("errors", tabsCssFile, 1, "Tabs focus state must render above the indicator for both interactive focus and focus demos.");
    }
  }
  if (component === "tooltip") {
    if (items.some((item) => String(item.label ?? "").length > 120)) add("errors", componentCopyFile, 1, "tooltip demos must keep copy short enough for a tooltip bubble.");
    const interactiveWords = /\b(button|link|form|input|select|submit|click here)\b/i;
    if (items.some((item) => interactiveWords.test(String(item.label ?? "")))) add("errors", componentCopyFile, 1, "tooltip copy must not imply interactive content inside the bubble.");
  }
  if (component === "toast") {
    if (items.some((item) => String(item.label ?? "").length > 80 || String(item.description ?? "").length > 120)) add("errors", componentCopyFile, 1, "toast demos must keep message and description short enough for non-blocking feedback.");
    if (items.some((item) => Array.isArray(item.actions) && item.actions.length > 1)) add("errors", componentCopyFile, 1, "toast demos must not expose more than one action.");
  }
  if (component === "inline-validation") {
    if (items.some((item) => item.state === "error" && !String(item.message ?? "").trim())) add("errors", componentCopyFile, 1, "inline-validation error demos need recovery copy.");
    if (items.some((item) => String(item.message ?? "").length > 100)) add("errors", componentCopyFile, 1, "inline-validation messages must stay short.");
  }
  if (component === "progress-indicator") {
    const progressRegistryFile = path.join(root, "packages/components/src/registry.js");
    const progressComponentFile = path.join(root, "packages/components/src/components/feedback.js");
    const progressRegistry = read(progressRegistryFile);
    const progressComponent = read(progressComponentFile);
    if (items.some((item) => (item.state === "indeterminate" || item.variant === "indeterminate") && item.showValue === true)) add("errors", componentCopyFile, 1, "progress-indicator indeterminate demos must not show fake values.");
    if (items.some((item) => item.variant !== "indeterminate" && item.state !== "indeterminate" && item.value == null)) add("errors", componentCopyFile, 1, "progress-indicator determinate demos need a real value.");
    if (progressRegistry.includes('variant === "circular" || variant === "indeterminate"')) add("errors", progressRegistryFile, 1, "progress-indicator indeterminate variant must render as linear indeterminate, not circular.");
    if (!progressComponent.includes("if (showValue && !indeterminate)")) add("errors", progressComponentFile, 1, "progress-indicator package implementation must suppress visible values while indeterminate.");
  }
  if (component === "skeleton") {
    const directBoneVariants = new Set(["title", "circle", "pill"]); if (items.some((item) => !["text", "title", "circle", "card", "pill", "row", "media", "chart", "table"].includes(item.variant))) add("errors", componentCopyFile, 1, "skeleton demos must use documented structural variants.");
    if (items.some((item) => item.variant === "table" ? Number(item.rows ?? item.lines ?? 0) < 1 : !directBoneVariants.has(item.variant) && Number(item.lines ?? 0) < 1)) add("errors", componentCopyFile, 1, "skeleton demos need at least one visible placeholder line.");
  }
}

function checkGoldDemoQuality() {
  const componentCopy = readJson(componentCopyFile);
  const spec = readSpec();

  for (const component of goldComponents) {
    const copy = componentCopy?.components?.[component];
    const contract = componentContracts[component];
    const specComponent = spec?.artifacts?.components?.[component];
    if (!copy || !contract) continue;

    const operationalItems = contract.operationalItems(copy["operational-example"]);
    const variantItems = contract.variantItems(copy.variants);
    const stateItems = contract.stateItems(copy.states);

    if (operationalItems.length < contract.minOperational) add("errors", componentCopyFile, 1, `${component} overview demo must include at least ${contract.minOperational} concrete examples.`);
    const minVariants = Math.min(contract.minVariants, Math.max(1, specComponent?.variants?.length ?? contract.minVariants));
    if (variantItems.length < minVariants) {
      add("errors", componentCopyFile, 1, `${component} design variants must include at least ${minVariants} component-scoped demos.`);
    }
    if (stateItems.length < contract.minStates) {
      add("errors", componentCopyFile, 1, `${component} design states must include at least ${contract.minStates} demos.`);
    }

    checkDisplayValues(component, "overview", operationalItems, contract.displayKeys);
    checkDisplayValues(component, "design variants", variantItems, contract.displayKeys);
    checkDisplayValues(component, "design states", stateItems, contract.displayKeys);
    checkPlayground(component, copy.playground, contract);
    checkComponentSpecificDemoQuality(component, copy, contract);
    checkFoundationCoverage(component, copy, specComponent);

    for (const { path, value } of walkValues(copy)) {
      if (/\.label$/.test(path) && isEmpty(value)) {
        add("errors", componentCopyFile, 1, `${component} has an empty label at ${path}.`);
      }
    }
  }
}

module.exports = { checkGoldDemoQuality };
