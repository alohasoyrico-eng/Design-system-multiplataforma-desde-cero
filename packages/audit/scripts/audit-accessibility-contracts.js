const {
  add,
  componentCopyFile,
  docsAppDir,
  docsStyleModuleFiles,
  fs,
  goldComponents,
  path,
  read,
  readJson,
  resolveBoundaryPath,
  root,
  readSpec,
} = require("./audit-context.js");

const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");

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
  return files.filter((file) => {
    try {
      read(file);
      return true;
    } catch {
      return false;
    }
  }).map((file) => read(file)).join("\n");
}

function checkComponentSemantics() {
  const copy = readJson(componentCopyFile)?.components ?? {};
  const spec = readSpec()?.artifacts?.components ?? {};

  for (const component of goldComponents) {
    const componentCopy = copy[component];
    const componentSpec = spec[component];
    if (!componentCopy || !componentSpec) continue;

    if (!componentCopy.accessibility?.items?.length) {
      add("errors", componentCopyFile, 1, `${component} needs explicit accessibility guidance before it can scale.`);
    }
    const accessibilityCoverage = componentSpec.foundations?.Accessibility;
    if (!accessibilityCoverage || accessibilityCoverage.status !== "covered") {
      add("errors", componentCopyFile, 1, `${component} spec must mark Accessibility as covered.`);
    }

    const source = sourceFor(component);
    for (const required of semanticRequirements[component] ?? []) {
      const alternatives = Array.isArray(required) ? required : [required];
      if (!alternatives.some((item) => source.includes(item))) {
        add("errors", path.join(docsAppDir, `gold-${component}-docs.js`), 1, `${component} rendered demo source must include accessibility semantic: ${alternatives[0]}.`);
      }
    }
  }
}

function checkFocusContracts() {
  const componentStyleFiles = docsStyleModuleFiles.filter((item) => /\/(?:04|05)[a-z0-9-]*\.css$/.test(item));
  const packageCssFile = path.join(root, "packages/components/styles/components.css");
  const packageCss = fs.existsSync(packageCssFile) ? read(packageCssFile) : "";
  for (const component of goldComponents) {
    if (nonFocusableByDefault.has(component)) continue;
    const files = componentStyleFiles.filter((file) => path.basename(file).includes(component));
    const packageOwnsFocus = packageCss.includes(`.${component}`);
    if (!files.length && !packageOwnsFocus) continue;
    const css = `${files.map((file) => read(file)).join("\n")}\n${packageOwnsFocus ? packageCss : ""}`;
    const source = sourceFor(component);
    const hasInteractiveSignal = /<(?:button|input|select|textarea|a)\b|tabindex="0"|role="(?:button|tab|menuitem|switch|checkbox|radio)"/.test(source);
    if (hasInteractiveSignal && !/:focus-visible|:focus-within|\[data-state="focus"\]/.test(css)) {
      add("errors", files[0] ?? packageCssFile, 1, `${component} styles need a visible focus contract.`);
    }
    if (/box-shadow:\s*var\(--.*focus/.test(css)) {
      add("errors", files[0] ?? packageCssFile, 1, "Focus must use outline/outline-offset, not box-shadow disguised as focus.");
    }
  }
}

function checkAccessibilityTokenOwnership() {
  const tokenCss = read(tokenCssFile);
  for (const token of [
    "--ref-a11y-touch-target-min",
    "--ref-a11y-contrast-aa",
    "--ref-a11y-motion-reduced-duration",
    "--sys-a11y-focus-ring",
    "--sys-a11y-focus-offset",
    "--sys-a11y-touch-target-min",
    "--sys-a11y-motion-duration",
  ]) {
    if (!tokenCss.includes(`${token}:`)) {
      add("errors", tokenCssFile, 1, `Accessibility token must be package-owned: ${token}.`);
    }
  }
}

function checkAccessibilityContracts() {
  checkAccessibilityTokenOwnership();
  checkComponentSemantics();
  checkFocusContracts();
}

module.exports = { checkAccessibilityContracts };
