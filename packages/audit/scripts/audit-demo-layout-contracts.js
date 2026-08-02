const { add, path, root, docsAppDir, read } = require("./audit-context.js");

const simpleDocsFile = path.join(docsAppDir, "gold-simple-component-docs.js");
const demoCellCssFile = path.join(root, "apps/docs/styles/04a-demo-cell-docs.css");

const wideDemoComponents = [
  "breadcrumbs",
  "date-range-picker",
  "pagination",
  "progress-indicator",
  "segmented-control",
  "stepper",
  "tabs",
];

const fullDemoComponents = ["skeleton", "table"];

function includesEvery(text, items) {
  return items.every((item) => text.includes(`"${item}"`));
}

function checkDemoLayoutContracts() {
  const simpleDocsText = read(simpleDocsFile);
  const demoCellCss = read(demoCellCssFile);

  if (!simpleDocsText.includes("function demoGridClass(") || !simpleDocsText.includes("function demoLayoutClass(")) {
    add("errors", simpleDocsFile, 1, "Simple docs must route demo sizing through shared layout helpers.");
  }

  if (!includesEvery(simpleDocsText, wideDemoComponents)) {
    add("errors", simpleDocsFile, 1, "Horizontal components must be listed in the wide demo layout family.");
  }

  if (!includesEvery(simpleDocsText, fullDemoComponents)) {
    add("errors", simpleDocsFile, 1, "Large surface components must be listed in the full demo layout family.");
  }

  if (!simpleDocsText.includes("docs-demo-grid--wide") || !simpleDocsText.includes("docs-demo-layout--wide")) {
    add("errors", simpleDocsFile, 1, "Wide demos must apply both grid and nested layout classes.");
  }

  if (!simpleDocsText.includes("docs-demo-grid--full") || !simpleDocsText.includes("docs-demo-layout--full")) {
    add("errors", simpleDocsFile, 1, "Full demos must apply both grid and nested layout classes.");
  }

  if (!demoCellCss.includes(".button-demo-grid.docs-demo-grid--wide") || !demoCellCss.includes(".button-demo-grid.docs-demo-grid--full")) {
    add("errors", demoCellCssFile, 1, "Demo layout CSS must override the default button-demo-grid contract with equal or higher specificity.");
  }

  if (!simpleDocsText.includes('demoLayoutClass(component, "simple-scenario")')) {
    add("errors", simpleDocsFile, 1, "Operational examples must apply the demo layout family at the scenario level.");
  }

  if (!demoCellCss.includes(".docs-demo-layout--wide.simple-scenario") || !demoCellCss.includes(".docs-demo-layout--full.simple-scenario")) {
    add("errors", demoCellCssFile, 1, "Operational scenarios must have wide/full layout overrides.");
  }

  if (!demoCellCss.includes("minmax(min(100%, 34rem), 1fr)") || !demoCellCss.includes("minmax(0, 1fr)")) {
    add("errors", demoCellCssFile, 1, "Demo layout CSS must define wide and full-width grid tracks.");
  }

  if (!demoCellCss.includes("overflow-x: auto")) {
    add("errors", demoCellCssFile, 1, "Wide/full demo bodies must allow horizontal overflow without shrinking dense components.");
  }
}

module.exports = { checkDemoLayoutContracts };
