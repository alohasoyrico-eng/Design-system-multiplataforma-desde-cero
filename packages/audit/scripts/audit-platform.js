const {
  fs,
  path,
  root,
  docsAppFile,
  docsContentSourcesFile,
  docsStyleModulePaths,
  catalogFile,
  manifestFile,
  foundations,
  primitiveNames,
  result,
  read,
  readJson,
  add,
} = require("./audit-context.js");

function checkArchitectureGate() {
  const forbiddenRootSources = ["app.js", "styles.css", "index.html", "specs", "content", "scripts/audit-system.js"];
  for (const source of forbiddenRootSources) {
    const absolute = path.join(root, source);
    if (fs.existsSync(absolute)) {
      add("errors", absolute, 1, `Architecture Gate: ${source} must not live at the workspace root.`);
    }
  }

  const requiredPaths = [
    "apps/docs/index.html",
    "apps/docs/app.js",
    "apps/docs/catalog-renderers.js",
    "apps/docs/content-loader.js",
    "apps/docs/content-sources.js",
    "apps/docs/generated/docs-content.bundle.json",
    "apps/docs/detail-tabs.js",
    "apps/docs/docs-chrome.js",
    "apps/docs/doc-interactions.js",
    "apps/docs/button-playground-interactions.js",
    "apps/docs/docs-layout.js",
    "apps/docs/docs-state.js",
    "apps/docs/family-component-docs.js",
    "apps/docs/foundation-explorer.js",
    "apps/docs/foundation-reference.js",
    "apps/docs/foundation-visual-sections.js",
    "apps/docs/gold-button-docs.js",
    "apps/docs/gold-card-docs.js",
    "apps/docs/gold-component-core.js",
    "apps/docs/gold-component-data.js",
    "apps/docs/gold-component-docs.js",
    "apps/docs/gold-select-docs.js",
    "apps/docs/home-stack-renderers.js",
    "apps/docs/icon-system.js",
    "apps/docs/navigation.js",
    "apps/docs/primitive-reference.js",
    "apps/docs/reference-demo-interactions.js",
    "apps/docs/reference-layout.js",
    "apps/docs/shell-controls.js",
    "apps/docs/select-interactions.js",
    "apps/docs/utils.js",
    "apps/docs/visual-examples.js",
    "apps/docs/styles.css",
    ...docsStyleModulePaths,
    "packages/specs/specs/unison.system.json",
    "packages/specs/package.json",
    "packages/content/package.json",
    "packages/content/content/component-docs.json",
    "packages/content/content/component-copy.json",
    "packages/content/content/foundation-copy.json",
    "packages/content/content/primitive-copy.json",
    "packages/content/content/reference-copy.json",
    "packages/content/content/catalog.json",
    "packages/content/content/home.json",
    "packages/content/content/fixtures/prototyping.json",
    "packages/content/content/i18n/ui.json",
    "packages/content/content/template-blueprints.json",
    "packages/audit/package.json",
    "packages/audit/scripts/audit-context.js",
    "packages/audit/scripts/audit-content-ownership.js",
    "packages/audit/scripts/audit-css.js",
    "packages/audit/scripts/audit-docs.js",
    "packages/audit/scripts/audit-docs-content.js",
    "packages/audit/scripts/audit-docs-runtime.mjs",
    "packages/audit/scripts/audit-system-scope.js",
    "packages/audit/scripts/audit-architecture-gate.js",
    "packages/audit/scripts/audit-gold-copy.js",
    "packages/audit/scripts/audit-gold-components.js",
    "packages/audit/scripts/audit-gold-docs.js",
    "packages/audit/scripts/audit-integration.js",
    "packages/audit/scripts/audit-package-api.js",
    "packages/audit/scripts/audit-platform.js",
    "packages/audit/scripts/audit-result.js",
    "packages/audit/scripts/audit-routes.js",
    "packages/audit/scripts/audit-spec.js",
    "packages/audit/scripts/audit-system.js",
    "packages/tokens/package.json",
    "packages/tokens/src/index.js",
    "packages/tokens/styles/tokens.css",
    "packages/components/package.json",
    "packages/components/src/index.js",
    "packages/components/src/contracts.js",
    "packages/components/styles/components.css",
    "packages/components/test/smoke.test.mjs",
    "examples/prototyping/index.html",
    "examples/prototyping/basic.html",
    "examples/prototyping/fleet-dashboard.html",
    "examples/prototyping/driver-mobile.html",
    "package.json",
    "README.md", "docs/repo-split-plan.md",
    "MIGRATE_PRODUCT_SCREEN.md",
    "CHANGELOG.md",
    "RELEASE.md",
    "START.md",
    "starter-kits/designer.md",
    "starter-kits/developer.md",
    "starter-kits/agent.md",
    "system.manifest.json",
    "scripts/build-docs-content.mjs", "scripts/build-docs-assets.mjs",
    "scripts/audit-system-split.mjs", "scripts/audit-docs-split.mjs",
  ];
  for (const requiredPath of requiredPaths) {
    if (!fs.existsSync(path.join(root, requiredPath))) {
      add("errors", path.join(root, requiredPath), 1, `Architecture Gate: required platform path is missing: ${requiredPath}.`);
    }
  }

  const maxAuditModuleLines = 400;
  const auditScriptsDir = path.join(root, "packages/audit/scripts");
  for (const fileName of fs.readdirSync(auditScriptsDir).filter((file) => file.startsWith("audit-") && file.endsWith(".js"))) {
    const file = path.join(auditScriptsDir, fileName);
    const lines = read(file).split("\n").length;
    if (lines > maxAuditModuleLines) {
      add("errors", file, 1, `Audit module has ${lines} lines; split it below ${maxAuditModuleLines} lines before scaling Design System governance.`);
    }
  }

  const maxSourceJsonLines = 400;
  const sourceJsonDirs = [
    path.join(root, "packages/content/content"),
    path.join(root, "packages/specs/specs"),
  ];
  for (const sourceJsonDir of sourceJsonDirs) {
    for (const file of listFiles(sourceJsonDir).filter((candidate) => candidate.endsWith(".json"))) {
      const lines = read(file).split("\n").length;
      if (lines > maxSourceJsonLines) {
        add("errors", file, 1, `Source JSON has ${lines} lines; split it below ${maxSourceJsonLines} lines before scaling Design System content/specs.`);
      }
    }
  }

  const manifest = readJson(manifestFile);
  if (!manifest) {
    add("errors", manifestFile, 1, "Architecture Gate: system.manifest.json is required and must be valid JSON.");
    return;
  }

  const expectedOwnership = {
    specs: "packages/specs",
    content: "packages/content",
    audit: "packages/audit",
    docs: "apps/docs",
    tokens: "packages/tokens",
    components: "packages/components",
    examples: "examples/prototyping",
    release: "RELEASE.md",
    adoption: "START.md",
    starterKits: "starter-kits",
    rootReadme: "README.md",
    tests: "packages/components/test",
    migrationGuide: "MIGRATE_PRODUCT_SCREEN.md",
  };
  for (const [key, expectedPath] of Object.entries(expectedOwnership)) {
    if (manifest.ownership?.[key] !== expectedPath) {
      add("errors", manifestFile, 1, `Architecture Gate: manifest ownership.${key} must be ${expectedPath}.`);
    }
  }

  if (manifest.sourceOfTruth?.docsSiteOwnsTruth !== false) {
    add("errors", manifestFile, 1, "Architecture Gate: docsSiteOwnsTruth must be false.");
  }
  for (const sourcePath of manifest.sourceOfTruth?.canonicalPaths ?? []) {
    if (sourcePath.startsWith("apps/docs/")) {
      add("errors", manifestFile, 1, `Architecture Gate: docs app cannot be a canonical source of truth: ${sourcePath}.`);
    }
  }
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(file) : [file];
  });
}

function checkPrototypePackages() {
  const tokenSource = path.join(root, "packages/tokens/src/index.js");
  const tokenCss = path.join(root, "packages/tokens/styles/tokens.css");
  const componentSource = path.join(root, "packages/components/src/index.js");
  const componentContracts = path.join(root, "packages/components/src/contracts.js");
  const componentCss = path.join(root, "packages/components/styles/components.css");
  const fixtureFile = path.join(root, "packages/content/content/fixtures/prototyping.json");
  const exampleFiles = [
    path.join(root, "examples/prototyping/index.html"),
    path.join(root, "examples/prototyping/basic.html"),
    path.join(root, "examples/prototyping/fleet-dashboard.html"),
    path.join(root, "examples/prototyping/driver-mobile.html"),
  ];

  const tokenText = read(tokenSource);
  const tokenCssText = read(tokenCss);
  const componentText = read(componentSource);
  const componentContractText = read(componentContracts);
  const componentCssText = read(componentCss);
  const fixtureData = readJson(fixtureFile);

  for (const required of ["systemTokens", "color", "space", "radius", "typography"]) {
    if (!tokenText.includes(required)) add("errors", tokenSource, 1, `tokens export missing: ${required}.`);
  }
  for (const required of ["--sys-color-action", "--sys-space-md", "--sys-radius-md", "--sys-font-body"]) {
    if (!tokenCssText.includes(required)) add("errors", tokenCss, 1, `tokens CSS variable missing: ${required}.`);
  }
  for (const required of [
    { exportName: "createButton", factoryName: "createButton" },
    { exportName: "createIconButton", factoryName: "createIconButton" },
    { exportName: "createInput", factoryName: "createInput" },
    { exportName: "createSelect", factoryName: "createSelect" },
    { exportName: "createCard", factoryName: "createCard" },
  ]) {
    if (!hasPublicComponentExport(componentText, required.exportName)) add("errors", componentSource, 1, `components export missing: ${required.exportName}.`);
    if (required.factoryName && !componentContractText.includes(`factory: "${required.factoryName}"`)) add("errors", componentContracts, 1, `components contract missing factory: ${required.factoryName}.`);
  }
  for (const required of ["button", "iconButton", "input", "select", "card", "props", "accessibility", "componentContractVersion"]) {
    if (!componentContractText.includes(required)) add("errors", componentContracts, 1, `components contract missing: ${required}.`);
  }
  for (const required of [".button", ".icon-button", ".input", ".select", ".card"]) {
    if (!componentCssText.includes(required)) add("errors", componentCss, 1, `components CSS contract missing: ${required}.`);
  }
  if (!Array.isArray(fixtureData?.fleets) || fixtureData.fleets.length < 3 || !fixtureData.driverCard || !Array.isArray(fixtureData.movements)) {
    add("errors", fixtureFile, 1, "Prototype fixtures must include fleets, driverCard, and movements.");
  }
  for (const exampleFile of exampleFiles) {
    const exampleText = read(exampleFile);
    if (!exampleText.includes("packages/components")) {
      add("errors", exampleFile, 1, "Prototype example must consume components.");
    }
    if (exampleFile.endsWith("index.html")) {
      for (const required of ["basic.html", "fleet-dashboard.html", "driver-mobile.html"]) {
        if (!exampleText.includes(required)) add("errors", exampleFile, 1, `Prototype index must link to ${required}.`);
      }
    } else if (exampleFile.endsWith("basic.html")) {
      for (const required of ["createButton", "createIconButton", "createInput", "createSelect", "createCard"]) {
        if (!exampleText.includes(required)) add("errors", exampleFile, 1, `Basic prototype must consume ${required}.`);
      }
      if (!exampleText.includes("fixtures/prototyping.json")) {
        add("errors", exampleFile, 1, "Basic prototype must consume shared prototyping fixtures.");
      }
    } else if (!exampleText.includes("fixtures/prototyping.json")) {
      add("errors", exampleFile, 1, "Role prototype must consume shared prototyping fixtures.");
    }
  }
}

function hasPublicComponentExport(source, name) {
  return source.includes(`export function ${name}`)
    || new RegExp(`export \\{[^}]*\\b${name}\\b[^}]*\\} from`).test(source);
}

function checkReleaseAndAdoption() {
  const packageJsonFile = path.join(root, "package.json");
  const readmeFile = path.join(root, "README.md");
  const changelogFile = path.join(root, "CHANGELOG.md");
  const releaseFile = path.join(root, "RELEASE.md");
  const startGuideFile = path.join(root, "START.md");
  const migrationGuideFile = path.join(root, "MIGRATE_PRODUCT_SCREEN.md");
  const componentSmokeTestFile = path.join(root, "packages/components/test/smoke.test.mjs");
  const starterKitFiles = [
    path.join(root, "starter-kits/designer.md"),
    path.join(root, "starter-kits/developer.md"),
    path.join(root, "starter-kits/agent.md"),
  ];

  const packageJson = readJson(packageJsonFile);
  if (packageJson?.version !== "0.3.0-platform-mvp") {
    add("errors", packageJsonFile, 1, "Root package version must match the platform MVP release.");
  }
  if (packageJson?.scripts?.audit !== "node packages/audit/scripts/audit-complete.mjs") {
    add("errors", packageJsonFile, 1, "Root package must expose npm run audit as the complete audit entrypoint.");
  }
  const expectedAuditScripts = {
    "audit:system": "node packages/audit/scripts/audit-system-scope.js",
    "audit:docs": "node packages/audit/scripts/audit-docs.js",
    "audit:integration": "node packages/audit/scripts/audit-integration.js",
    "audit:repo-boundary": "node packages/audit/scripts/audit-repo-boundary-runner.js",
  };
  for (const [script, command] of Object.entries(expectedAuditScripts)) {
    if (packageJson?.scripts?.[script] !== command) {
      add("errors", packageJsonFile, 1, `Root package must expose ${script} for split repo validation.`);
    }
  }
  const expectedSupportScripts = {
    test: "node packages/components/test/smoke.test.mjs",
    "build:docs-content": "node scripts/build-docs-content.mjs",
    "build:docs-assets": "node scripts/build-docs-assets.mjs",
    "build:docs": "npm run build:docs-content && npm run build:docs-assets",
    "audit:component-demo-registry": "node packages/audit/scripts/audit-component-demo-registry.mjs",
    "audit:component-catalog-classification": "node packages/audit/scripts/audit-component-catalog-classification.mjs",
    "audit:component-demo-interactions": "node packages/audit/scripts/audit-component-demo-interactions.mjs",
  };
  for (const [script, command] of Object.entries(expectedSupportScripts)) {
    if (packageJson?.scripts?.[script] !== command) add("errors", packageJsonFile, 1, `Root package must expose npm run ${script}.`);
  }
  const expectedValidationScripts = {
    "validate:system": "npm run audit:system && npm test && npm run audit:system-split",
    "validate:docs": "npm run build:docs && npm run audit:docs && npm run audit:docs-runtime && npm run audit:docs-split",
    "validate:integration": "npm run audit:repo-boundary && npm run audit:integration && npm run audit:component-demo-registry && npm run audit:component-catalog-classification && npm run audit:component-demo-interactions",
    validate: "npm run audit",
  };
  for (const [script, command] of Object.entries(expectedValidationScripts)) {
    if (packageJson?.scripts?.[script] !== command) {
      add("errors", packageJsonFile, 1, `Root package must expose ${script} for Design System/docs repo boundary validation.`);
    }
  }

  const manifest = readJson(manifestFile);
  if (manifest?.release?.version !== packageJson?.version) {
    add("errors", manifestFile, 1, "Manifest release version must match package.json.");
  }
  if (manifest?.release?.validationCommand !== "npm run validate" || manifest?.release?.testCommand !== "npm test") {
    add("errors", manifestFile, 1, "Manifest release commands must include npm run validate and npm test.");
  }
  for (const [file, requiredSnippets] of [
    [readmeFile, ["Design System OS", "npm run validate", "Package Map", "MIGRATE_PRODUCT_SCREEN.md"]],
    [changelogFile, ["0.3.0-platform-mvp", "packages/tokens", "packages/components"]],
    [releaseFile, ["npm run audit", "npm test", "npm run validate", "Architecture Gate", "CHANGELOG.md", "MIGRATE_PRODUCT_SCREEN.md", "index.html", "fleet-dashboard.html", "driver-mobile.html"]],
    [startGuideFile, ["Build a Prototype", "Change Design System", "What To Edit", "MIGRATE_PRODUCT_SCREEN.md", "npm run validate", "npm test", "fixtures/prototyping.json", "examples/prototyping/index.html"]],
    [migrationGuideFile, ["Migrate A Product Screen Into Design System", "Nothing skips a layer", "packages/specs", "packages/components", "npm run validate"]],
    [componentSmokeTestFile, ["componentContracts", "createButton", "createIconButton", "createInput", "createSelect", "createCard", "components smoke tests passed"]],
  ]) {
    const text = read(file);
    for (const snippet of requiredSnippets) {
      if (!text.includes(snippet)) add("errors", file, 1, `Release/adoption doc missing: ${snippet}.`);
    }
  }
  for (const file of starterKitFiles) {
    const text = read(file);
    if (!text.includes("Design System") || !text.includes("audit")) {
      add("errors", file, 1, "Starter kit must name Design System and the audit handoff.");
    }
  }
}

function countInventory() {
  const appFile = docsAppFile;
  const app = read(appFile);
  const catalog = readJson(catalogFile);
  result.inventory = {
    foundations: catalog?.foundations?.length ?? 0,
    primitives: catalog?.primitives?.length ?? 0,
    components: catalog?.components?.length ?? 0,
    patterns: catalog?.patterns?.length ?? 0,
    templates: catalog?.templates?.length ?? 0,
    stack: catalog?.stack?.length ?? 0,
  };

  if (result.inventory.foundations !== foundations.length) {
    add("errors", catalogFile, 1, `Expected ${foundations.length} foundations, found ${result.inventory.foundations}.`);
  }

  if (result.inventory.primitives !== primitiveNames.length) {
    add("errors", catalogFile, 1, `Expected ${primitiveNames.length} primitives, found ${result.inventory.primitives}.`);
  }

  const contentSources = fs.existsSync(docsContentSourcesFile) ? read(docsContentSourcesFile) : "";
  if (!contentSources.includes("loadDocsContent") || !contentSources.includes("generated/docs-content.bundle.json")) {
    add("errors", appFile, 1, "Docs app must load the artifact inventory from the generated docs content bundle.");
  }
  if (contentSources.includes("packages/content/") || contentSources.includes("packages/specs/")) {
    add("errors", docsContentSourcesFile, 1, "Docs runtime must not load Design System content or specs source paths; use the generated docs content bundle.");
  }
  if (!app.includes("content-sources.js?v=") || !contentSources.includes("content-loader.js?v=")) {
    add("errors", docsContentSourcesFile, 1, "Docs content loader imports must be versioned so bundle delivery cannot be bypassed by module cache.");
  }

  for (const embeddedInventoryPattern of [/item\("foundation"/, /primitive\("/, /component\("/, /pattern\("/, /template\("/]) {
    if (embeddedInventoryPattern.test(app)) {
      add("errors", appFile, 1, "Docs app must not embed artifact inventory entries; use catalog.json.");
      break;
    }
  }
}

module.exports = { checkArchitectureGate, checkPrototypePackages, checkReleaseAndAdoption, countInventory };
