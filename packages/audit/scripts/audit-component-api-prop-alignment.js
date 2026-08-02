const {
  fs,
  path,
  add,
  read,
} = require("./audit-context.js");

const root = process.cwd();
const componentCopyRoot = path.join(root, "packages/content/content/component-copy/components");
const componentSourceRoot = path.join(root, "packages/components/src/components");

const ignoredParserTokens = new Set(["false", "true"]);
const publicPropAliases = {
  avatar: {
    density: "size",
  },
};
const unprefixedFactoryNames = new Map([
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

function factoryName(id) {
  if (unprefixedFactoryNames.has(id)) return unprefixedFactoryNames.get(id);
  return `create${id
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("")}`;
}

function packageSource() {
  return fs.readdirSync(componentSourceRoot)
    .filter((file) => file.endsWith(".js"))
    .map((file) => read(path.join(componentSourceRoot, file)))
    .join("\n");
}

function factoryProps(source, id) {
  const name = factoryName(id);
  const functionIndex = source.indexOf(`function ${name}`);
  const exportIndex = source.indexOf(`${name}(`);
  const index = functionIndex >= 0 ? functionIndex : exportIndex;
  if (index < 0) return null;
  const chunk = source.slice(index, index + 1800);
  const match = chunk.match(/\{([\s\S]*?)\}\s*=\s*\{\}/);
  if (!match) return [];
  return [...match[1].matchAll(/\b([A-Za-z_$][\w$]*)\b\s*(?:=|,)/g)]
    .map((propMatch) => propMatch[1])
    .filter((prop, propIndex, props) => !ignoredParserTokens.has(prop) && props.indexOf(prop) === propIndex);
}

function checkComponentApiPropAlignment() {
  const source = packageSource();
  for (const id of fs.readdirSync(componentCopyRoot).sort()) {
    const file = path.join(componentCopyRoot, id, "all.json");
    if (!fs.existsSync(file)) continue;
    const content = JSON.parse(read(file));
    const visibleProps = content.components?.[id]?.["api-foundations"]?.props?.map((prop) => prop.name) ?? [];
    if (!visibleProps.length) continue;

    const implementationProps = factoryProps(source, id);
    if (!implementationProps) continue;
    const aliases = publicPropAliases[id] ?? {};
    const aliasTargets = new Set(Object.values(aliases));
    const visibleOnly = visibleProps.filter((prop) => {
      const implementationProp = aliases[prop] ?? prop;
      return !implementationProps.includes(implementationProp);
    });
    const implementationOnly = implementationProps.filter((prop) => !visibleProps.includes(prop) && !aliasTargets.has(prop));

    if (visibleOnly.length) {
      add("errors", file, 1, `${id} documents API props not accepted by the package factory: ${visibleOnly.join(", ")}.`);
    }
    if (implementationOnly.length) {
      add("errors", file, 1, `${id} package factory props are missing from visible API docs: ${implementationOnly.join(", ")}.`);
    }
  }
}

module.exports = { checkComponentApiPropAlignment };
