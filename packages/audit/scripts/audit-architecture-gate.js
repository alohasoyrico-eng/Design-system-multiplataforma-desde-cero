const { fs, path, root, manifestFile, read, readJson, add } = require("./audit-context.js");

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(file) : [file];
  });
}

function checkSystemArchitectureGate() {
  const requiredPaths = [
    "packages/specs/specs/unison.system.json",
    "packages/specs/package.json",
    "packages/content/package.json",
    "packages/content/content/catalog.json",
    "packages/content/content/component-docs.json",
    "packages/content/content/component-copy.json",
    "packages/content/content/foundation-copy.json",
    "packages/content/content/primitive-copy.json",
    "packages/content/content/reference-copy.json",
    "packages/content/content/template-blueprints.json",
    "packages/audit/package.json",
    "packages/audit/scripts/audit-system-scope.js",
    "packages/audit/scripts/audit-architecture-gate.js",
    "packages/audit/scripts/audit-package-api.js",
    "packages/audit/scripts/audit-result.js",
    "packages/tokens/package.json",
    "packages/tokens/src/index.js",
    "packages/tokens/styles/tokens.css",
    "packages/components/package.json",
    "packages/components/src/index.js",
    "packages/components/src/contracts.js",
    "packages/components/styles/components.css",
    "packages/components/test/smoke.test.mjs",
    "package.json",
    "system.manifest.json",
  ];
  for (const requiredPath of requiredPaths) {
    if (!fs.existsSync(path.join(root, requiredPath))) {
      add("errors", path.join(root, requiredPath), 1, `Design System Architecture Gate: required path is missing: ${requiredPath}.`);
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

  for (const sourceJsonDir of [
    path.join(root, "packages/content/content"),
    path.join(root, "packages/specs/specs"),
  ]) {
    for (const file of listFiles(sourceJsonDir).filter((candidate) => candidate.endsWith(".json"))) {
      const lines = read(file).split("\n").length;
      if (lines > 400) add("errors", file, 1, `Source JSON has ${lines} lines; split it below 400 lines before scaling Design System content/specs.`);
    }
  }

  const manifest = readJson(manifestFile);
  if (!manifest) {
    add("errors", manifestFile, 1, "Design System Architecture Gate: system.manifest.json is required and must be valid JSON.");
    return;
  }
  if (manifest.sourceOfTruth?.docsSiteOwnsTruth !== false) {
    add("errors", manifestFile, 1, "Design System Architecture Gate: docsSiteOwnsTruth must be false.");
  }
  for (const sourcePath of manifest.sourceOfTruth?.canonicalPaths ?? []) {
    if (sourcePath.startsWith("apps/docs/")) {
      add("errors", manifestFile, 1, `Design System Architecture Gate: docs app cannot be a canonical source of truth: ${sourcePath}.`);
    }
  }
}

module.exports = { checkSystemArchitectureGate };
