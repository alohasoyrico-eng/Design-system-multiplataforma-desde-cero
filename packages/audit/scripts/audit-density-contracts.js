const {
  path,
  root,
  read,
  add,
} = require("./audit-context.js");

const contractsFile = path.join(root, "packages/components/src/contracts.js");
const packageCssFile = path.join(root, "packages/components/styles/components.css");
const sourceFiles = {
  actions: path.join(root, "packages/components/src/components/actions.js"),
  commerce: path.join(root, "packages/components/src/components/commerce.js"),
  display: path.join(root, "packages/components/src/components/display.js"),
  feedback: path.join(root, "packages/components/src/components/feedback.js"),
  fields: path.join(root, "packages/components/src/components/fields.js"),
  interactions: path.join(root, "packages/components/src/components/interactions.js"),
  navigation: path.join(root, "packages/components/src/components/navigation.js"),
  overlays: path.join(root, "packages/components/src/components/overlays.js"),
  specializedInputs: path.join(root, "packages/components/src/components/specialized-inputs.js"),
};

const directDensityComponents = [
  { id: "button", factory: "createButton", source: "actions", selector: '.button[data-density="sm"]', token: "--button-current-size" },
  { id: "iconButton", factory: "createIconButton", source: "actions", selector: '.icon-button[data-density="sm"]', token: "--icon-button-size" },
  { id: "progressIndicator", factory: "createProgressIndicator", source: "feedback", selector: '.progress[data-density="sm"]', token: "--progress-track-size" },
  { id: "spinner", factory: "createSpinner", source: "feedback", selector: '.spinner[data-density="sm"]', token: "--spinner-size" },
  { id: "tooltip", factory: "createTooltip", source: "overlays", selector: '.tooltip[data-density="sm"]', token: "--comp-tooltip-trigger-min-block" },
  { id: "popover", factory: "createPopover", source: "overlays", selector: '.popover[data-density="sm"]', token: "--popover-panel-padding" },
  { id: "accordion", factory: "createAccordion", source: "interactions", selector: '.accordion[data-density="sm"]', token: "--accordion-trigger-min-block" },
  { id: "treeView", factory: "createTreeView", source: "interactions", selector: '.tree-view[data-density="sm"]', token: "--tree-view-control-min-block" },
  { id: "emptyState", factory: "createEmptyState", source: "feedback", selector: '.empty-state[data-density="sm"]', token: "--empty-state-icon-size" },
  { id: "errorPanel", factory: "createErrorPanel", source: "feedback", selector: '.error-panel[data-density="sm"]', token: "--error-panel-icon-size" },
  { id: "dialog", factory: "createDialog", source: "overlays", selector: '.dialog[data-density="sm"]', token: "--dialog-icon-size" },
  { id: "drawer", factory: "createDrawer", source: "overlays", selector: '.drawer[data-density="sm"]', token: "--drawer-panel-padding" },
  { id: "list", factory: "createList", source: "display", selector: '.list[data-density="sm"]', token: "--list-item-padding" },
  { id: "kpiTile", factory: "createKpiTile", source: "display", selector: '.kpi-tile[data-density="sm"]', token: "--kpi-tile-padding" },
  { id: "menu", factory: "createMenu", source: "overlays", selector: '.menu[data-density="sm"]', token: "--comp-menu-item-height" },
  { id: "breadcrumbs", factory: "createBreadcrumbs", source: "navigation", selector: '.breadcrumbs[data-density="sm"]', token: "--breadcrumbs-target-block" },
  { id: "pagination", factory: "createPagination", source: "navigation", selector: '.pagination[data-density="sm"]', token: "--pagination-size" },
  { id: "stepper", factory: "createStepper", source: "navigation", selector: '.stepper[data-density="sm"]', token: "--stepper-marker-size" },
  { id: "chartPanel", factory: "createChartPanel", source: "commerce", selector: '.chart-panel[data-density="sm"]', token: "--chart-panel-plot-size" },
  { id: "codeInput", factory: "createCodeInput", source: "specializedInputs", selector: '.code-input[data-density="sm"]', token: "--code-input-slot-block-size" },
  { id: "datePicker", factory: "createDatePicker", source: "specializedInputs", selector: '.date-picker[data-density="sm"]', token: "--date-picker-control-size" },
  { id: "segmentedControl", factory: "createSegmentedControl", source: "interactions", selector: '.segmented-control[data-density="sm"]', token: "--segmented-control-item-min-block" },
];

const delegatedDensityComponents = [
  { id: "input", factory: "createInput", source: "fields", delegate: "createFieldShell", selector: '.field[data-density="sm"]' },
  { id: "combobox", factory: "createCombobox", source: "fields", delegate: "createFieldShell", selector: '.field[data-density="sm"]' },
  { id: "textArea", factory: "createTextArea", source: "fields", delegate: "createFieldShell", selector: '.field[data-density="sm"]' },
  { id: "cardNumberInput", factory: "createCardNumberInput", source: "specializedInputs", delegate: "createFieldShell", selector: '.field[data-density="sm"]' },
  { id: "cardExpiryInput", factory: "createCardExpiryInput", source: "specializedInputs", delegate: "createFieldShell", selector: '.field[data-density="sm"]' },
  { id: "cardSecurityCodeInput", factory: "createCardSecurityCodeInput", source: "specializedInputs", delegate: "createFieldShell", selector: '.field[data-density="sm"]' },
  { id: "select", factory: "createSelect", source: "fields", delegate: "createSelectControl", selector: '.select-control[data-density="sm"]' },
  { id: "countrySelector", factory: "createCountrySelector", source: "specializedInputs", delegate: "createSelectControl", selector: '.select-control[data-density="sm"]' },
  { id: "phoneInput", factory: "createPhoneInput", source: "specializedInputs", delegate: "createFieldShell and createCountrySelector", selector: '.field[data-density="sm"]' },
  { id: "dateRangePicker", factory: "createDateRangePicker", source: "specializedInputs", delegate: "date-picker shell", selector: '.date-picker[data-density="sm"]' },
];

function checkDensityContracts() {
  const contracts = read(contractsFile);
  const css = read(packageCssFile);
  const allComponents = [...directDensityComponents, ...delegatedDensityComponents];

  for (const component of allComponents) {
    if (!contractDeclaresDensity(contracts, component.id)) {
      add("errors", contractsFile, 1, `${component.id} must declare density before package source can expose density variants.`);
    }
    const source = read(sourceFiles[component.source]);
    const body = factoryBody(source, component.factory);
    if (!body) {
      add("errors", sourceFiles[component.source], 1, `${component.factory} must exist for density contract enforcement.`);
      continue;
    }
    if (!body.includes('density = "md"')) {
      add("errors", sourceFiles[component.source], 1, `${component.factory} must default density to md.`);
    }
  }

  for (const component of directDensityComponents) {
    const source = read(sourceFiles[component.source]);
    const body = factoryBody(source, component.factory);
    if (!/dataset\.density\s*=\s*(?:density|resolvedDensity)/.test(body) && !body.includes("createFieldShell({")) {
      add("errors", sourceFiles[component.source], 1, `${component.factory} must expose data-density on its package root.`);
    }
    checkCssDensity(css, component.selector, component.token, component.id);
  }

  for (const component of delegatedDensityComponents) {
    const source = read(sourceFiles[component.source]);
    const body = factoryBody(source, component.factory);
    if (!body.includes("density")) {
      add("errors", sourceFiles[component.source], 1, `${component.factory} must forward density to its owned package shell.`);
    }
    checkCssDensity(css, component.selector, null, component.id);
  }

  const selectControlBody = functionBody(read(sourceFiles.fields), "createSelectControl");
  if (!selectControlBody.includes("control.dataset.density = density")) {
    add("errors", sourceFiles.fields, 1, "Select control must expose data-density for Select and Country Selector.");
  }

  const menuBody = factoryBody(read(sourceFiles.overlays), "createMenu");
  if (!menuBody.includes("density: resolvedDensity")) {
    add("errors", sourceFiles.overlays, 1, "Menu trigger must forward resolved density to Button or Icon Button instead of using a fixed trigger size.");
  }
}

function contractDeclaresDensity(contracts, id) {
  const keyIndex = contracts.indexOf(`${id}: {`);
  if (keyIndex < 0) return false;
  const nextComponentIndex = contracts.indexOf("\n  },", keyIndex);
  const block = contracts.slice(keyIndex, nextComponentIndex > keyIndex ? nextComponentIndex : keyIndex + 1200);
  return block.includes('name: "density"');
}

function factoryBody(source, factoryName) {
  return functionBody(source, factoryName);
}

function functionBody(source, name) {
  const startPattern = new RegExp(`(?:export\\s+)?function\\s+${name}\\s*\\(`);
  const match = startPattern.exec(source);
  if (!match) return "";
  const nextMatch = /\n(?:export\s+)?function\s+[A-Za-z0-9_]+\s*\(/g;
  nextMatch.lastIndex = match.index + 1;
  const next = nextMatch.exec(source);
  return source.slice(match.index, next?.index ?? source.length);
}

function checkCssDensity(css, smSelector, token, id) {
  const lgSelector = smSelector.replace('[data-density="sm"]', '[data-density="lg"]');
  if (!css.includes(smSelector)) {
    add("errors", packageCssFile, 1, `${id} must define sm density CSS for ${smSelector}.`);
  }
  if (!css.includes(lgSelector)) {
    add("errors", packageCssFile, 1, `${id} must define lg density CSS for ${lgSelector}.`);
  }
  if (token && !css.includes(token)) {
    add("errors", packageCssFile, 1, `${id} density CSS must use ${token} instead of one-off sizing.`);
  }
}

module.exports = { checkDensityContracts };
