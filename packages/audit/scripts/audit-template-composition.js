const {
  add,
  read,
  readJson,
  root,
  path,
} = require("./audit-context.js");

const templatesFile = path.join(root, "packages/content/content/catalog/templates.json");
const templateBlueprintsFile = path.join(root, "packages/content/content/template-blueprints.json");
const desktopDemoFile = path.join(root, "apps/docs/template-desktop-demos.js");
const shellRenderersFile = path.join(root, "apps/docs/pattern-shell-renderers.js");
const businessRenderersFile = path.join(root, "apps/docs/pattern-business-renderers.js");
const requiredFoundations = ["energy", "frame", "voice", "depth", "momentum", "state", "tone", "growth", "symbol", "iconography", "accessibility"];

function checkTemplateComposition() {
  const catalog = readJson(templatesFile);
  const blueprints = readJson(templateBlueprintsFile)?.templates ?? {};
  const demoSource = read(desktopDemoFile);
  const shellRendererSource = read(shellRenderersFile);
  const businessRendererSource = read(businessRenderersFile);
  const renderers = {
    "fleet-manager-desktop": "fleetManagerDesktopDemo",
    "fleet-dashboard-suite": "dashboardSuiteDemo",
    "configuration-console": "configurationConsoleDemo",
  };

  for (const entry of (catalog.templates ?? []).filter((item) => item.platform === "Desktop")) {
    const blueprint = blueprints[entry.title];
    const rendererName = renderers[entry.id];
    const rendererSource = rendererName ? functionSource(demoSource, rendererName) : "";
    const requiredPatterns = entry.patternsUsed ?? [];

    if (!rendererName || !rendererSource) add("errors", desktopDemoFile, 1, `Missing desktop template renderer for ${entry.id}.`);
    if (!blueprint) add("errors", templateBlueprintsFile, 1, `Template blueprint missing for ${entry.title}.`);
    if (!requiredPatterns.includes("Topbar")) add("errors", templatesFile, 1, `${entry.id} must declare Topbar as a consumed pattern.`);
    if (!requiredPatterns.includes("Sidebar")) add("errors", templatesFile, 1, `${entry.id} must declare Sidebar as a consumed pattern.`);

    for (const pattern of requiredPatterns) {
      if (!blueprint?.processDetails?.[pattern]) add("errors", templateBlueprintsFile, 1, `${entry.title} missing processDetails for consumed pattern ${pattern}.`);
    }

    const packageDemoCalls = [
      rendererSource,
      shellRendererSource,
      entry.id === "configuration-console" ? businessRendererSource : "",
    ].join("\n").match(/packageDemo\(/g)?.length ?? 0;
    if (packageDemoCalls < 6) add("errors", desktopDemoFile, 1, `${entry.id} must compose Design System package components; found ${packageDemoCalls} packageDemo calls.`);

    if (entry.id === "configuration-console") {
      for (const rendererCall of ["renderRolesAndPermissionsToolbar(", "renderRolesAndPermissionsPattern(", "renderDriverVehicleAdministrationPattern(", "renderAdminRiskReviewPattern("]) {
        if (!rendererSource.includes(rendererCall)) add("errors", desktopDemoFile, 1, `Configuration Console must consume ${rendererCall.replace("(", "")}.`);
      }
      for (const marker of ["vehicleRows", "data-config-permission-message", "data-config-panel-grid", "data-template-feedback"]) {
        if (!rendererSource.includes(marker)) add("errors", desktopDemoFile, 1, `Configuration Console must include functional template marker: ${marker}.`);
      }
    }
    if (rendererSource.includes("template-desktop-demo__module") || rendererSource.includes("template-desktop-demo__audit")) {
      add("errors", desktopDemoFile, 1, `${entry.id} must not use local card-like template module surfaces; use Design System Card roots.`);
    }
  }

  if (!demoSource.includes("patternBadges(patterns)")) add("errors", desktopDemoFile, 1, "Template shell must render visible badges for consumed patterns.");
  if (!demoSource.includes("data-template-pattern-badge")) add("errors", desktopDemoFile, 1, "Template pattern badges must be marked with data-template-pattern-badge.");
  if (!demoSource.includes("data-template-foundations")) add("errors", desktopDemoFile, 1, "Desktop template demos must declare the foundations they consume.");
  for (const foundation of requiredFoundations) {
    if (!demoSource.includes(foundation) || !shellRendererSource.includes(foundation)) {
      add("errors", desktopDemoFile, 1, `Desktop template demos must declare ${foundation} foundation usage in the shell and pattern renderers.`);
    }
  }
  if (!demoSource.includes("renderTopbarPattern(")) add("errors", desktopDemoFile, 1, "Desktop templates must consume the Topbar pattern renderer.");
  if (!demoSource.includes("renderSidebarPattern(")) add("errors", desktopDemoFile, 1, "Desktop templates must consume the Sidebar pattern renderer.");
  if (!demoSource.includes('class="template-desktop-demo__body"')) add("errors", desktopDemoFile, 1, "Desktop template shell must place Topbar above a Sidebar/content body, matching Design System docs shell structure.");
  if (/template-desktop-demo__workspace[\s\S]*renderTopbarPattern/.test(demoSource)) add("errors", desktopDemoFile, 1, "Desktop template Topbar must not render inside the workspace column.");
  if (!shellRendererSource.includes('data-pattern-renderer="topbar"')) add("errors", shellRenderersFile, 1, "Topbar pattern renderer must expose data-pattern-renderer.");
  if (!shellRendererSource.includes('data-pattern-renderer="sidebar"')) add("errors", shellRenderersFile, 1, "Sidebar pattern renderer must expose data-pattern-renderer.");
  for (const marker of ['class="topbar template-pattern-topbar"', "searchSlotMarkup", "top-actions", 'class="sidebar template-pattern-sidebar"', "sidebar-group", "sidebar-label", "sidebar-count"]) {
    if (!shellRendererSource.includes(marker)) add("errors", shellRenderersFile, 1, `Shell pattern renderers must consume real pattern anatomy: ${marker}.`);
  }
  for (const marker of ['class="brand"', 'slotClass: "template-pattern-topbar__search"', 'inputId: "templateTopSearch"', 'inputAttrs: { "data-template-search": ""', 'pattern-notification-button', "avatarMenuMarkup", "data-template-account-menu", "logo.svg", 'packageDemo("badge"']) {
    if (!shellRendererSource.includes(marker)) add("errors", shellRenderersFile, 1, `Topbar/Sidebar template shell must match the real Design System docs shell: ${marker}.`);
  }
  for (const forbidden of ["language-toggle", "data-template-export", "grid_off", "contrast"]) {
    if (shellRendererSource.includes(forbidden)) add("errors", shellRenderersFile, 1, `Configuration template Topbar must use notification/account variant, not ${forbidden}.`);
  }
  if (/<aside[\s\S]*template-pattern-sidebar[\s\S]*?<\/aside>/.exec(shellRendererSource)?.[0]?.includes("logo.svg")) {
    add("errors", shellRenderersFile, 1, "Template Sidebar must match docs sidebar and must not repeat the Design System brand; brand belongs to Topbar.");
  }
  if (businessRendererSource.includes("template-pattern-chip")) add("errors", businessRenderersFile, 1, "Pattern ownership markers must not render as visible chips inside product templates.");
  for (const marker of ['data-pattern-renderer="roles-and-permissions"', '"data-pattern-renderer": "driver-and-vehicle-administration"', '"data-pattern-renderer": "admin-risk-review"']) {
    if (!businessRendererSource.includes(marker)) add("errors", businessRenderersFile, 1, `Business pattern renderer missing ${marker}.`);
  }
  for (const marker of ['"data-template-panel": "roles"', '"data-template-panel": "drivers"', '"data-template-panel": "vehicles"', '"data-template-panel": "audit"', "data-config-role-control", "data-config-lifecycle-action", "data-config-audit-log"]) {
    if (!businessRendererSource.includes(marker)) add("errors", businessRenderersFile, 1, `Configuration Console renderer missing functional marker ${marker}.`);
  }
  if (!businessRendererSource.includes('packageDemo("segmented-control"') || businessRendererSource.includes("<div class=\"segmented")) {
    add("errors", businessRenderersFile, 1, "Configuration Console role switcher must use Design System Segmented Control through packageDemo.");
  }
  for (const marker of ["data-template-module-card", "template-module-content"]) {
    if (!businessRendererSource.includes(marker)) add("errors", businessRenderersFile, 1, `Configuration Console module surfaces must use Design System Card roots with marker ${marker}.`);
  }
  for (const forbidden of ["template-desktop-demo__module", "template-desktop-demo__audit"]) {
    if (businessRendererSource.includes(forbidden)) add("errors", businessRenderersFile, 1, `Configuration Console must not use local card-like surface ${forbidden}; use Design System Card.`);
  }
  for (const component of ["button", "badge", "segmented-control", "card", "table", "checkbox", "switch", "audit-event", "error-panel"]) {
    if (!businessRendererSource.includes(`packageDemo("${component}"`)) add("errors", businessRenderersFile, 1, `Business pattern renderers must compose Design System ${component}.`);
  }
  if (/<button(?![^`]*packageDemo)/.test(demoSource)) add("errors", desktopDemoFile, 1, "Desktop template demos must not declare raw custom <button> elements.");
  if (/<button(?![^`]*packageDemo)/.test(businessRendererSource)) add("errors", businessRenderersFile, 1, "Business pattern renderers must not declare raw custom <button> elements.");
}

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}`);
  if (start < 0) return "";
  const next = source.indexOf("\nfunction ", start + 1);
  return source.slice(start, next < 0 ? source.length : next);
}

module.exports = { checkTemplateComposition };
