const {
  add,
  path,
  read,
  requiredComponentContracts,
  root,
} = require("./audit-context.js");

const registryFile = path.join(root, "packages/components/src/registry.js");
const indexFile = path.join(root, "packages/components/src/index.js");
const removedDocsAdapterFiles = [
  "apps/docs/component-demo-adapter.js",
  "apps/docs/component-core-demo-adapter.js",
  "apps/docs/component-surface-demo-adapter.js",
  "apps/docs/component-table-demo-adapter.js",
].map((file) => path.join(root, file));
const docsRendererFile = path.join(root, "apps/docs/component-demo.js");
const unprefixedFactoryComponents = new Map([
  ["button", "createButton"],
  ["icon-button", "createIconButton"],
  ["badge", "createBadge"],
  ["card", "createCard"],
  ["checkbox", "createCheckbox"],
  ["chip", "createChip"],
  ["empty-state", "createEmptyState"],
  ["error-panel", "createErrorPanel"],
  ["floating-action-button", "createFloatingActionButton"],
  ["inline-validation", "createInlineValidation"],
  ["input", "createInput"],
  ["select", "createSelect"],
  ["radio-button", "createRadioButton"],
  ["switch", "createSwitch"],
  ["tag", "createTag"],
  ["text-area", "createTextArea"],
  ["code-input", "createCodeInput"],
  ["phone-input", "createPhoneInput"],
  ["progress-indicator", "createProgressIndicator"],
  ["spinner", "createSpinner"],
  ["card-number-input", "createCardNumberInput"],
  ["card-expiry-input", "createCardExpiryInput"],
  ["card-security-code-input", "createCardSecurityCodeInput"],
  ["date-picker", "createDatePicker"],
  ["skeleton", "createSkeleton"],
  ["avatar", "createAvatar"],
  ["list", "createList"],
  ["kpi-tile", "createKpiTile"],
  ["audit-event", "createAuditEvent"],
  ["table", "createTable"],
  ["chart-panel", "createChartPanel"],
  ["station-pin", "createStationPin"],
  ["route-summary", "createRouteSummary"],
  ["card-summary", "createCardSummary"],
  ["movement-row", "createMovementRow"],
  ["quick-action", "createQuickAction"],
  ["tabs", "createTabs"],
  ["accordion", "createAccordion"],
  ["slider", "createSlider"],
  ["tree-view", "createTreeView"],
  ["segmented-control", "createSegmentedControl"],
  ["breadcrumbs", "createBreadcrumbs"],
  ["pagination", "createPagination"],
  ["stepper", "createStepper"],
  ["tooltip", "createTooltip"],
  ["toast", "createToast"],
  ["dialog", "createDialog"],
  ["menu", "createMenu"],
  ["drawer", "createDrawer"],
  ["popover", "createPopover"],
  ["motion-boundary", "createMotionBoundary"],
  ["animated-moment", "createAnimatedMoment"],
  ["biometric-prompt", "createBiometricPrompt"],
]);

function checkComponentRegistry() {
  const registrySource = read(registryFile);
  const indexSource = read(indexFile);

  for (const component of requiredComponentContracts) {
    const key = component.includes("-") ? `"${component}"` : component;
    const expectedFactory = unprefixedFactoryComponents.get(component);
    const expectedFactoryReference = expectedFactory ? `${key}: ${expectedFactory}` : `${key}: create`;
    if (!registrySource.includes(expectedFactoryReference)) {
      add("errors", registryFile, 1, `Package component registry missing gold component: ${component}.`);
    }
  }

  for (const exportName of ["componentRegistry", "renderComponent", "renderComponentDemo", "componentDemoProps", "listComponents", "hasComponent"]) {
    if (!indexSource.includes(exportName)) {
      add("errors", indexFile, 1, `Design System package index must export ${exportName}.`);
    }
  }

  if (!registrySource.includes("componentDemoProps") || !registrySource.includes("renderComponentDemo")) {
    add("errors", registryFile, 1, "Package component registry must own demo prop normalization and demo rendering.");
  }

  const docsRendererSource = read(docsRendererFile);
  if (!docsRendererSource.includes("renderComponentDemo")) {
    add("errors", docsRendererFile, 1, "Docs component demo renderer must consume the official Design System registry demo renderer.");
  }
  if (/import\s+\{[^}]*create[A-Z]/.test(docsRendererSource) || /\bcreate[A-Z][A-Za-z0-9_]*\(/.test(docsRendererSource.replace(/\bdocument\.create[A-Z][A-Za-z0-9_]*\(/g, ""))) {
    add("errors", docsRendererFile, 1, "Docs component demo renderer must not import or call create* factories directly.");
  }

  for (const file of removedDocsAdapterFiles) {
    if (require("fs").existsSync(file)) {
      add("errors", file, 1, "Docs component adapters are no longer allowed; consume apps/docs/component-demo.js and the Design System registry.");
    }
  }
}

module.exports = { checkComponentRegistry };
