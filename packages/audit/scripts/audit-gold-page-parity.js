const {
  add,
  componentCopyFile,
  componentDocsFile,
  docsGoldComponentModuleFiles,
  goldComponents,
  read,
  readJson,
} = require("./audit-context.js");

const baselineTabs = ["overview", "design", "build", "miel"];
const requiredSections = [
  "operational-example",
  "anatomy",
  "accessibility",
  "variants",
  "states",
  "variant-state-behavior",
  "full-width",
  "responsive-layout-patterns",
  "viewport-organization",
  "playground",
  "guidelines",
  "api-foundations",
  "tests-rejection-rules",
  "miel",
];
const parityComponents = goldComponents.filter((component) => component !== "button");

function checkGoldPageParity() {
  const componentDocs = readJson(componentDocsFile);
  const componentCopy = readJson(componentCopyFile);
  const ui = readJson(require("./audit-context.js").uiI18nFile);
  const runtimeByName = Object.fromEntries(
    docsGoldComponentModuleFiles.map((file) => [file.split("/").pop(), read(file)]),
  );
  const sharedSimpleRuntime = runtimeByName["gold-simple-component-docs.js"] ?? "";

  for (const component of parityComponents) {
    const docs = componentDocs?.components?.[component];
    const copy = componentCopy?.components?.[component];
    if (JSON.stringify(docs?.tabs) !== JSON.stringify(baselineTabs)) {
      add("errors", componentDocsFile, 1, `${component} must use the Button gold tab sequence.`);
    }
    if (docs?.renderer !== component) {
      add("errors", componentDocsFile, 1, `${component} renderer id must match component id.`);
    }
    for (const section of requiredSections) {
      if (!copy?.[section]) {
        add("errors", componentCopyFile, 1, `${component} gold page missing standard section: ${section}.`);
      }
    }
    for (const [section, minLength] of [
      ["operational-example", 70],
      ["variants", 70],
      ["states", 70],
      ["playground", 70],
      ["miel", 120],
    ]) {
      const length = copy?.[section]?.copy?.length ?? 0;
      if (length < minLength) {
        add("errors", componentCopyFile, 1, `${component} ${section} copy is too thin for gold page parity (${length}).`);
      }
    }
    for (const section of ["canDecide", "mustAsk", "rejectIf"]) {
      if ((copy?.miel?.[section]?.length ?? 0) < 3) {
        add("errors", componentCopyFile, 1, `${component} MIEL ${section} must include at least three decision bullets.`);
      }
    }
    if ((copy?.miel?.handoff?.length ?? 0) < 60) {
      add("errors", componentCopyFile, 1, `${component} MIEL handoff must make the human-agent handoff explicit.`);
    }

    const camel = component.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const pascal = camel[0].toUpperCase() + camel.slice(1);
    const fileName = `gold-${component}-docs.js`;
    const runtime = runtimeByName[fileName] ?? "";
    for (const fn of [
      `${camel}OperationalExamplePanel`,
      `${camel}AnatomyPanel`,
      `${camel}AccessibilityPanel`,
      `${camel}VariantsPanel`,
      `${camel}StatesPanel`,
      `${camel}StateVariantMatrixPanel`,
      `${camel}FullWidthPanel`,
      `${camel}ResponsivePanel`,
      `${camel}ViewportOrganizationPanel`,
      `${camel}PlaygroundPanel`,
      `${camel}ContractPanel`,
      `${camel}GuidelinesPanel`,
      `${camel}TestPanel`,
      `render${pascal}GoldSection`,
      `${camel}Demo`,
    ]) {
      if (!runtime.includes(`function ${fn}`) && !runtime.includes(`export function ${fn}`)) {
        add("errors", fileName, 1, `${component} renderer must expose standard gold page function: ${fn}.`);
      }
    }
    if (/SummaryPanel/.test(runtime)) {
      add("errors", fileName, 1, `${component} renderer should use standard panel names, not SummaryPanel aliases.`);
    }
    const usesSharedSimpleRenderer = runtime.includes("renderSimpleGoldSection");
    if (!/aria-label=/.test(runtime) && !usesSharedSimpleRenderer && runtime.includes("playground-controls")) {
      add("errors", fileName, 1, `${component} playground controls must include an aria-label.`);
    }
    if (!runtime.includes(`data-component-playground="${component}"`) && !(usesSharedSimpleRenderer && sharedSimpleRuntime.includes('data-component-playground="${component}"'))) {
      add("errors", fileName, 1, `${component} playground must use the shared interactive component playground contract.`);
    }
    const playgroundRuntime = usesSharedSimpleRenderer ? `${runtime}\n${sharedSimpleRuntime}` : runtime;
    if (!playgroundRuntime.includes("data-component-playground-input") || !playgroundRuntime.includes("data-component-preview") || !playgroundRuntime.includes("data-component-markup")) {
      add("errors", fileName, 1, `${component} playground controls, preview, and markup must be wired for interaction.`);
    }
    const playgroundKey = `playground.${camel}Controls`;
    for (const locale of ["en", "es"]) {
      if (!ui?.locales?.[locale]?.[playgroundKey]) {
        add("errors", require("./audit-context.js").uiI18nFile, 1, `${component} playground aria label missing i18n key: ${locale}.${playgroundKey}.`);
      }
    }
  }
}

module.exports = { checkGoldPageParity };
