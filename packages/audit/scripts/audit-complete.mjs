#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const auditScriptsDir = path.join(root, "packages/audit/scripts");
const forbiddenPrefix = "fl" + "ow-";

const expectedAuditFiles = new Set([
  "audit-accessibility-contracts.js",
  "audit-architecture-gate.js",
  "audit-batch-zip-parity.js",
  "audit-complete.mjs",
  "audit-component-1to1-quality-matrix.js",
  "audit-component-api-prop-alignment.js",
  "audit-component-behavior-contracts.js",
  "audit-component-catalog-classification.mjs",
  "audit-component-contract-alignment.js",
  "audit-component-contracts.js",
  "audit-component-demo-interactions.mjs",
  "audit-component-demo-registry.mjs",
  "audit-component-implementation-status.js",
  "audit-component-modules.js",
  "audit-component-motion-role-coverage.js",
  "audit-component-registry.js",
  "audit-component-remediation-coverage.js",
  "audit-content-ownership.js",
  "audit-context.js",
  "audit-css-ownership.js",
  "audit-css.js",
  "audit-demo-layout-contracts.js",
  "audit-density-contracts.js",
  "audit-docs-content.js",
  "audit-docs-runtime.mjs",
  "audit-docs.js",
  "audit-energy-contracts.js",
  "audit-frame-contracts.js",
  "audit-foundation-cascade-contracts.js",
  "audit-foundation-contracts.js",
  "audit-gold-components.js",
  "audit-gold-copy.js",
  "audit-gold-demo-quality.js",
  "audit-gold-docs.js",
  "audit-gold-page-parity.js",
  "audit-integration.js",
  "audit-layout-contracts.js",
  "audit-motion-contracts.js",
  "audit-package-api.js",
  "audit-package-css-contracts.js",
  "audit-pattern-contracts.js",
  "audit-platform.js",
  "audit-primitive-contracts.js",
  "audit-repo-boundary-runner.js",
  "audit-repo-boundary.js",
  "audit-result.js",
  "audit-routes.js",
  "audit-spec.js",
  "audit-state-contracts.js",
  "audit-system-scope.js",
  "audit-system.js",
  "audit-table-contracts.js",
  "audit-template-composition.js",
  "audit-voice-contracts.js",
  "report-foundation-accessibility-cascade.js",
  "report-foundation-depth-cascade.js",
  "report-foundation-energy-cascade.js",
  "report-foundation-frame-cascade.js",
  "report-foundation-growth-cascade.js",
  "report-foundation-iconography-cascade.js",
  "report-foundation-momentum-cascade.js",
  "report-foundation-state-cascade.js",
  "report-foundation-symbol-cascade.js",
  "report-foundation-tone-cascade.js",
  "report-foundation-voice-cascade.js",
  "report-primitive-color-cascade.js",
  "report-primitive-typography-cascade.js",
  "report-foundation-quality.js",
]);

const checks = [
  ["audit registry", auditRegistry],
  ["audit entrypoints", auditEntrypoints],
  ["public prefix", auditPublicPrefix],
  ["foundation contracts", () => run("node", ["scripts/generate-foundation-contracts.mjs", "--check"])],
  ["accessibility cascade report", () => run("node", ["packages/audit/scripts/report-foundation-accessibility-cascade.js", "--check"])],
  ["depth cascade report", () => run("node", ["packages/audit/scripts/report-foundation-depth-cascade.js", "--check"])],
  ["energy cascade report", () => run("node", ["packages/audit/scripts/report-foundation-energy-cascade.js", "--check"])],
  ["frame cascade report", () => run("node", ["packages/audit/scripts/report-foundation-frame-cascade.js", "--check"])],
  ["growth cascade report", () => run("node", ["packages/audit/scripts/report-foundation-growth-cascade.js", "--check"])],
  ["iconography cascade report", () => run("node", ["packages/audit/scripts/report-foundation-iconography-cascade.js", "--check"])],
  ["momentum cascade report", () => run("node", ["packages/audit/scripts/report-foundation-momentum-cascade.js", "--check"])],
  ["state cascade report", () => run("node", ["packages/audit/scripts/report-foundation-state-cascade.js", "--check"])],
  ["symbol cascade report", () => run("node", ["packages/audit/scripts/report-foundation-symbol-cascade.js", "--check"])],
  ["tone cascade report", () => run("node", ["packages/audit/scripts/report-foundation-tone-cascade.js", "--check"])],
  ["voice cascade report", () => run("node", ["packages/audit/scripts/report-foundation-voice-cascade.js", "--check"])],
  ["foundation cascade readiness", auditFoundationCascadeReadiness],
  ["primitive contracts", () => run("node", ["scripts/generate-primitive-contracts.mjs", "--check"])],
  ["color primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-color-cascade.js", "--check"])],
  ["typography primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-typography-cascade.js", "--check"])],
  ["docs build", () => run("npm", ["run", "build:docs"])],
  ["static system/docs/integration", () => run("node", ["packages/audit/scripts/audit-system.js"])],
  ["component smoke tests", () => run("npm", ["test"])],
  ["docs runtime", () => run("node", ["packages/audit/scripts/audit-docs-runtime.mjs"])],
  ["repo boundary", () => run("node", ["packages/audit/scripts/audit-repo-boundary-runner.js"])],
  ["system split", () => run("node", ["scripts/audit-system-split.mjs"])],
  ["docs split", () => run("node", ["scripts/audit-docs-split.mjs"])],
  ["component demo registry", () => run("node", ["packages/audit/scripts/audit-component-demo-registry.mjs"])],
  ["component catalog classification", () => run("node", ["packages/audit/scripts/audit-component-catalog-classification.mjs"])],
  ["component demo interactions", () => run("node", ["packages/audit/scripts/audit-component-demo-interactions.mjs"])],
];

const summary = {
  status: "pass",
  checks: [],
};

for (const [name, check] of checks) {
  try {
    const started = Date.now();
    check();
    summary.checks.push({ name, status: "pass", ms: Date.now() - started });
  } catch (error) {
    summary.status = "fail";
    summary.checks.push({ name, status: "fail", message: error.message });
    break;
  }
}

console.log(JSON.stringify(summary, null, 2));
if (summary.status !== "pass") process.exitCode = 1;

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
    throw new Error(`${command} ${args.join(" ")} failed`);
  }
}

function auditRegistry() {
  const actual = fs.readdirSync(auditScriptsDir)
    .filter((file) => /^(audit-|report-).*\.(?:js|mjs)$/.test(file))
    .sort();
  const missing = [...expectedAuditFiles].filter((file) => !actual.includes(file));
  const unregistered = actual.filter((file) => !expectedAuditFiles.has(file));
  if (missing.length || unregistered.length) {
    throw new Error(`Audit registry mismatch. Missing: ${missing.join(", ") || "none"}. Unregistered: ${unregistered.join(", ") || "none"}.`);
  }
}

function auditEntrypoints() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  if (packageJson.scripts?.audit !== "node packages/audit/scripts/audit-complete.mjs") {
    throw new Error("npm run audit must point at audit-complete.mjs.");
  }
  if (packageJson.scripts?.validate !== "npm run audit") {
    throw new Error("npm run validate must delegate to the single complete audit.");
  }

  for (const file of ["audit-system.js", "audit-docs.js", "audit-integration.js", "audit-system-scope.js"]) {
    const source = fs.readFileSync(path.join(auditScriptsDir, file), "utf8");
    const calls = [...source.matchAll(/\b(check[A-Z][A-Za-z0-9]+)\(\);/g)].map((match) => match[1]);
    const duplicates = calls.filter((call, index) => calls.indexOf(call) !== index);
    if (duplicates.length) {
      throw new Error(`${file} invokes duplicate checks: ${[...new Set(duplicates)].join(", ")}.`);
    }
  }
}

function auditPublicPrefix() {
  const roots = ["packages", "apps", "docs"];
  const offenders = [];
  for (const entry of roots) scan(path.join(root, entry), offenders);
  if (offenders.length) {
    throw new Error(`Forbidden public prefix found: ${offenders.slice(0, 20).join(", ")}`);
  }
}

function auditFoundationCascadeReadiness() {
  const auditDir = path.join(root, "docs/audits");
  const reports = fs.readdirSync(auditDir)
    .filter((file) => /^foundation-.*-cascade-audit\.json$/.test(file))
    .sort();
  const blockers = [];
  for (const reportFile of reports) {
    const report = JSON.parse(fs.readFileSync(path.join(auditDir, reportFile), "utf8"));
    if (report.status !== "pass") {
      blockers.push(`${report.foundation ?? reportFile}: ${report.status} (${(report.gaps ?? []).length} gaps)`);
    }
  }
  if (blockers.length) {
    throw new Error(`Foundation cascade is not ready for primitives. Blocking reports: ${blockers.join("; ")}.`);
  }
}

function scan(target, offenders) {
  if (!fs.existsSync(target)) return;
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    if (target.includes(`${path.sep}repo-split-output${path.sep}`)) return;
    for (const entry of fs.readdirSync(target)) scan(path.join(target, entry), offenders);
    return;
  }
  if (!/\.(?:css|html|js|mjs|json|md)$/.test(target)) return;
  const text = fs.readFileSync(target, "utf8");
  if (new RegExp(`(?<!over)${forbiddenPrefix}`).test(text)) offenders.push(path.relative(root, target));
}
