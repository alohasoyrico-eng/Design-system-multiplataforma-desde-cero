const { path, root, readJson, add } = require("./audit-context.js");

const boundaryImports = [
  "#design-system/components",
  "#design-system/components-css",
  "#design-system/content/catalog",
  "#design-system/content/component-docs",
  "#design-system/content/component-copy",
  "#design-system/content/pattern-copy",
  "#design-system/content/component-implementation-status",
  "#design-system/content/foundation-copy",
  "#design-system/content/primitive-copy",
  "#design-system/content/reference-copy",
  "#design-system/content/template-blueprints",
  "#design-system/content/home",
  "#design-system/content/i18n-ui",
  "#design-system/specs/system",
  "#design-system/tokens-css",
];

const contentExports = [
  "./catalog",
  "./component-docs",
  "./component-copy",
  "./pattern-copy",
  "./component-implementation-status",
  "./foundation-copy",
  "./primitive-copy",
  "./reference-copy",
  "./template-blueprints",
  "./home",
  "./i18n/ui",
  "./component-behavior-contracts",
  "./component-quality-backlog",
  "./pattern-backlog",
  "./fixtures/prototyping",
];

function checkPackageApiBoundary() {
  const packageJsonFile = path.join(root, "package.json");
  const contentPackageJsonFile = path.join(root, "packages/content/package.json");
  const rootImports = readJson(packageJsonFile)?.imports ?? {};
  const exportedContent = readJson(contentPackageJsonFile)?.exports ?? {};

  for (const requiredImport of boundaryImports) {
    if (!rootImports[requiredImport]) add("errors", packageJsonFile, 1, `Root package imports missing public boundary alias: ${requiredImport}.`);
  }
  for (const requiredExport of contentExports) {
    if (!exportedContent[requiredExport]) add("errors", contentPackageJsonFile, 1, `@design-system/content export missing: ${requiredExport}.`);
  }
}

module.exports = { checkPackageApiBoundary };
