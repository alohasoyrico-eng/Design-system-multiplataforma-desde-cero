const {
  add,
  docsAppDir,
  docsCssFile,
  fs,
  path,
  read,
  readDocsCss,
  root,
} = require("./audit-context.js");

function requireCss(pattern, message) {
  const css = readDocsCss();
  if (!pattern.test(css)) add("errors", docsCssFile, 1, message);
}

function checkDemoGridLayout() {
  const css = readDocsCss();

  for (const selector of [".button-demo-grid", ".state-behavior-grid", ".tabs-doc-demo-grid", ".table-doc-demo-grid"]) {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const block = css.match(new RegExp(`${escaped}\\s*\\{(?<body>[^}]+)\\}`))?.groups?.body ?? "";
    if (!/inline-size:\s*100%;/.test(block)) {
      add("errors", docsCssFile, 1, `${selector} must use the available documentation width instead of leaving unused space.`);
    }
    if (/inline-size:\s*min\(100%,\s*calc\(/.test(block)) {
      add("errors", docsCssFile, 1, `${selector} must not cap documentation demos to a fixed column count.`);
    }
  }

  requireCss(/\.button-demo-grid\s*{[^}]*grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(min\(100%,\s*18rem\),\s*1fr\)\);/s, "Default demo grids need an 18rem useful minimum.");
  requireCss(/\.state-behavior-grid\s*{[^}]*grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(min\(100%,\s*24rem\),\s*1fr\)\);/s, "State behavior grids need a wider 24rem useful minimum.");
  requireCss(/\.tabs-doc-demo-grid\s*{[^}]*grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(min\(100%,\s*28rem\),\s*1fr\)\);/s, "Tabs demos need a 28rem useful minimum so tab labels do not compress.");
  requireCss(/@media \(max-width:\s*900px\)\s*{[\s\S]*\.button-demo-grid,[\s\S]*\.state-behavior-grid,[\s\S]*\.full-width-demo,[\s\S]*grid-template-columns:\s*1fr;/s, "Documentation demos must collapse to one column at tablet/phone widths.");
}

function checkFullWidthDemos() {
  const docsRendererFile = path.join(docsAppDir, "component-demo.js");
  const docsRenderer = read(docsRendererFile);
  const css = readDocsCss();
  const packageCssFile = path.join(root, "packages/components/styles/components.css");
  const packageCss = fs.existsSync(packageCssFile) ? read(packageCssFile) : "";
  if (!docsRenderer.includes('node.setAttribute("data-full-width", String(Boolean(demo.fullWidth)))')) {
    add("errors", docsRendererFile, 1, "Package-backed component demos must expose data-full-width from content.");
  }
  requireCss(/\.docs-package-demo\[data-full-width="true"\]\s*{[^}]*inline-size:\s*100%;[^}]*max-inline-size:\s*100%;/s, "Package-backed full-width demos must fill their documentation container through the docs package hook.");
  if (!/\.button\[data-full-width="true"\]\s*{[^}]*inline-size:\s*100%;/s.test(packageCss)) {
    add("errors", packageCssFile, 1, "Button full-width behavior must be owned by the package source.");
  }
  requireCss(/\.table-doc-demo-grid \.table-demo\s*{[^}]*inline-size:\s*100%;/s, "Table demos inside wide documentation grids must fill their container.");
}

function checkLayoutContracts() {
  checkDemoGridLayout();
  checkFullWidthDemos();
}

module.exports = { checkLayoutContracts };
