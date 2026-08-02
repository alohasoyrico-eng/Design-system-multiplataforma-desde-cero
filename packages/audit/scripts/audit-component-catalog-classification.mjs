#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const bundlePath = path.join(repoRoot, "apps/docs/generated/docs-content.bundle.json");
const backlogPath = path.join(repoRoot, "packages/content/content/component-quality-backlog.json");
const implementationStatusPath = path.join(repoRoot, "packages/content/content/component-implementation-status.json");
const candidatePlansPath = path.join(repoRoot, "apps/docs/candidate-component-plans.js");
const candidateLayoutCssPath = path.join(repoRoot, "apps/docs/styles/04b-component-standard-layout.css");
const componentDocsPath = path.join(repoRoot, "packages/content/content/component-docs.json");
const componentCopyPath = path.join(repoRoot, "packages/content/content/component-copy.json");
const componentCopyComponentsDir = path.join(repoRoot, "packages/content/content/component-copy/components");
const packageIndexPath = path.join(repoRoot, "packages/components/src/index.js");
const packageContractsPath = path.join(repoRoot, "packages/components/src/contracts.js");
const goldComponentDocsPath = path.join(repoRoot, "apps/docs/gold-component-docs.js");
const buildDocsContentPath = path.join(repoRoot, "scripts/build-docs-content.mjs");
const contentSourcesPath = path.join(repoRoot, "apps/docs/content-sources.js");
const docsStatePath = path.join(repoRoot, "apps/docs/docs-state.js");
const appPath = path.join(repoRoot, "apps/docs/app.js");
const catalogRenderersPath = path.join(repoRoot, "apps/docs/catalog-renderers.js");
const docsLayoutPath = path.join(repoRoot, "apps/docs/docs-layout.js");

const bundle = JSON.parse(fs.readFileSync(bundlePath, "utf8"));
const backlog = JSON.parse(fs.readFileSync(backlogPath, "utf8"));
const implementationStatus = JSON.parse(fs.readFileSync(implementationStatusPath, "utf8"));
const componentDocs = JSON.parse(fs.readFileSync(componentDocsPath, "utf8"));
const componentCopy = JSON.parse(fs.readFileSync(componentCopyPath, "utf8"));
const candidateLayoutCss = fs.readFileSync(candidateLayoutCssPath, "utf8");
const packageIndexSource = fs.readFileSync(packageIndexPath, "utf8");
const packageContractsSource = fs.readFileSync(packageContractsPath, "utf8");
const goldComponentDocsSource = fs.readFileSync(goldComponentDocsPath, "utf8");
const buildDocsContentSource = fs.readFileSync(buildDocsContentPath, "utf8");
const contentSourcesSource = fs.readFileSync(contentSourcesPath, "utf8");
const docsStateSource = fs.readFileSync(docsStatePath, "utf8");
const appSource = fs.readFileSync(appPath, "utf8");
const catalogRenderersSource = fs.readFileSync(catalogRenderersPath, "utf8");
const docsLayoutSource = fs.readFileSync(docsLayoutPath, "utf8");
const { candidateCompositionLayout, candidateCompositionPlans } = await import(pathToFileURL(candidatePlansPath).href);

const catalogComponentIds = (bundle.catalog?.components ?? []).map((component) => component.id);
const packageBackedIds = [
  ...(backlog.accepted ?? []),
  ...(backlog.contractPending ?? []),
  ...(backlog.scopeDecisionPending ?? []),
];
const candidateIds = backlog.candidateScopeDecisionPending ?? [];
const notes = backlog.scopeDecisionNotes ?? {};
const substitutionPlan = backlog.candidateSubstitutionPlan ?? {};
const implementationStatusIds = Object.keys(implementationStatus.components ?? {});
const candidateCoverageStatuses = ["sufficient-composition", "partial-substitute", "component-decision-needed"];

assertNoDuplicates("catalog components", catalogComponentIds);
assertNoDuplicates("package-backed component backlog", packageBackedIds);
assertNoDuplicates("candidate scope decision backlog", candidateIds);
assertNoDuplicates("component implementation status", implementationStatusIds);

const catalogSet = new Set(catalogComponentIds);
const packageBackedSet = new Set(packageBackedIds);
const candidateSet = new Set(candidateIds);
const classifiedSet = new Set([...packageBackedIds, ...candidateIds]);

assert.equal(
  packageBackedIds.length + candidateIds.length,
  catalogComponentIds.length,
  "Component backlog must classify every catalog component route.",
);

const packageBackedNotInCatalog = packageBackedIds.filter((id) => !catalogSet.has(id));
assert.deepEqual(packageBackedNotInCatalog, [], `Package-backed ids missing from component catalog: ${packageBackedNotInCatalog.join(", ")}`);

const candidatesNotInCatalog = candidateIds.filter((id) => !catalogSet.has(id));
assert.deepEqual(candidatesNotInCatalog, [], `Candidate scope ids missing from component catalog: ${candidatesNotInCatalog.join(", ")}`);

const overlap = candidateIds.filter((id) => packageBackedSet.has(id));
assert.deepEqual(overlap, [], `Candidate scope ids must not also be package-backed: ${overlap.join(", ")}`);

const unclassified = catalogComponentIds.filter((id) => !classifiedSet.has(id));
assert.deepEqual(unclassified, [], `Component catalog routes must be package-backed or candidate scope decisions: ${unclassified.join(", ")}`);

const expectedCandidates = catalogComponentIds.filter((id) => !packageBackedSet.has(id));
assert.deepEqual(candidateIds, expectedCandidates, "Candidate scope decision list must exactly match catalog routes that are not package-backed.");

const missingImplementationStatus = packageBackedIds.filter((id) => !implementationStatus.components?.[id]);
assert.deepEqual(missingImplementationStatus, [], `Package-backed components need implementation status metadata: ${missingImplementationStatus.join(", ")}`);

const extraImplementationStatus = implementationStatusIds.filter((id) => !packageBackedSet.has(id));
assert.deepEqual(extraImplementationStatus, [], `Implementation status must only describe package-backed components, not candidates: ${extraImplementationStatus.join(", ")}`);

const candidateImplementationStatus = candidateIds.filter((id) => implementationStatus.components?.[id]);
assert.deepEqual(candidateImplementationStatus, [], `Candidate scope decisions must not be marked as implemented Package components: ${candidateImplementationStatus.join(", ")}`);

const candidateGoldDocs = candidateIds.filter((id) => componentDocs.components?.[id]);
assert.deepEqual(candidateGoldDocs, [], `Candidate scope decisions must not have gold component docs entries: ${candidateGoldDocs.join(", ")}`);

const candidateGoldCopy = candidateIds.filter((id) => componentCopy.components?.[id]);
assert.deepEqual(candidateGoldCopy, [], `Candidate scope decisions must not have gold component copy entries: ${candidateGoldCopy.join(", ")}`);

const candidateCopyShards = candidateIds.filter((id) => fs.existsSync(path.join(componentCopyComponentsDir, id)));
assert.deepEqual(candidateCopyShards, [], `Candidate scope decisions must not have component-copy shards until promoted: ${candidateCopyShards.join(", ")}`);

const candidateGoldModules = candidateIds.filter((id) => fs.existsSync(path.join(repoRoot, "apps/docs", `gold-${id}-docs.js`)));
assert.deepEqual(candidateGoldModules, [], `Candidate scope decisions must not have gold docs modules until promoted: ${candidateGoldModules.join(", ")}`);

const candidateGoldRendererImports = candidateIds.filter((id) => goldComponentDocsSource.includes(`gold-${id}-docs.js`) || goldComponentDocsSource.includes(`renderer === "${id}"`));
assert.deepEqual(candidateGoldRendererImports, [], `Candidate scope decisions must not be wired into gold-component-docs: ${candidateGoldRendererImports.join(", ")}`);

const candidatePackageExports = candidateIds.filter((id) => packageIndexSource.includes(`create${toPascal(id)}`));
assert.deepEqual(candidatePackageExports, [], `Candidate scope decisions must not be publicly exported from @design-system/components until promoted: ${candidatePackageExports.join(", ")}`);

const candidateContracts = candidateIds.filter((id) => packageContractsSource.includes(`${toCamel(id)}: {`) || packageContractsSource.includes(`create${toPascal(id)}`));
assert.deepEqual(candidateContracts, [], `Candidate scope decisions must not have package contracts until promoted: ${candidateContracts.join(", ")}`);

assert.ok(
  bundle.componentImplementationStatus?.components,
  "Docs content bundle must include componentImplementationStatus so the app can expose package-backed vs candidate scope.",
);
assert.ok(
  buildDocsContentSource.includes("componentImplementationStatus: resolveJsonShards") &&
    buildDocsContentSource.includes("#design-system/content/component-implementation-status"),
  "Docs content build must bundle component implementation status metadata through the public content alias.",
);
assert.ok(
  contentSourcesSource.includes("componentImplementationStatus") &&
    contentSourcesSource.includes("generated/docs-content.bundle.json") &&
    !contentSourcesSource.includes("component-implementation-status.json"),
  "Docs content loader must expose component implementation status from the generated bundle without runtime source fallbacks.",
);
assert.ok(
  docsStateSource.includes("export let componentImplementationStatus") &&
    docsStateSource.includes("componentImplementationStatus = localizedContent"),
  "Docs state must expose localized component implementation status.",
);
assert.ok(
  appSource.includes("componentImplementationStatus") &&
    appSource.includes("renderDetailContent({ artifactTypeLabel, collection, componentImplementationStatus"),
  "Docs app must pass component implementation status into catalog and detail renderers.",
);
assert.ok(
  catalogRenderersSource.includes("componentImplementationLabel") &&
    catalogRenderersSource.includes('"Package component"') &&
    catalogRenderersSource.includes('"Candidate scope"') &&
    catalogRenderersSource.includes("card-meta-row"),
  "Component catalog cards must visibly label Package component vs Candidate scope status.",
);
assert.ok(
  docsLayoutSource.includes("componentImplementationLabel") &&
    docsLayoutSource.includes('"Package component"') &&
    docsLayoutSource.includes('"Candidate scope"') &&
    docsLayoutSource.includes("detail-meta-tag"),
  "Component detail headers must visibly label Package component vs Candidate scope status.",
);

const missingNotes = candidateIds.filter((id) => typeof notes[id] !== "string" || !notes[id].trim());
assert.deepEqual(missingNotes, [], `Candidate scope decisions need notes: ${missingNotes.join(", ")}`);

const staleNotes = Object.keys(notes).filter((id) => !candidateSet.has(id));
assert.deepEqual(staleNotes, [], `Scope decision notes must not reference non-candidate ids: ${staleNotes.join(", ")}`);

const missingPlans = candidateIds.filter((id) => !substitutionPlan[id]);
assert.deepEqual(missingPlans, [], `Candidate scope decisions need substitution plans: ${missingPlans.join(", ")}`);

const stalePlans = Object.keys(substitutionPlan).filter((id) => !candidateSet.has(id));
assert.deepEqual(stalePlans, [], `Substitution plans must not reference non-candidate ids: ${stalePlans.join(", ")}`);

const docsPlanIds = Object.keys(candidateCompositionPlans ?? {});
assert.deepEqual(docsPlanIds, candidateIds, "Candidate composition docs must follow the candidate backlog order.");

const layoutFullWidth = candidateCompositionLayout?.fullWidthComponents ?? [];
const layoutNaturalWidth = candidateCompositionLayout?.naturalWidthComponents ?? [];
assertNoDuplicates("candidate full-width layout components", layoutFullWidth);
assertNoDuplicates("candidate natural-width layout components", layoutNaturalWidth);
const layoutOverlap = layoutFullWidth.filter((componentId) => layoutNaturalWidth.includes(componentId));
assert.deepEqual(layoutOverlap, [], `Candidate layout components must be either full-width or natural-width, not both: ${layoutOverlap.join(", ")}`);

const cssFullWidth = extractCandidateLayoutComponents(candidateLayoutCss, "inline-size: 100%;");
const cssNaturalWidth = extractCandidateLayoutComponents(candidateLayoutCss, "justify-self: start;");
assert.deepEqual(cssFullWidth, layoutFullWidth, "Candidate full-width CSS selectors must match candidateCompositionLayout.fullWidthComponents.");
assert.deepEqual(cssNaturalWidth, layoutNaturalWidth, "Candidate natural-width CSS selectors must match candidateCompositionLayout.naturalWidthComponents.");

for (const id of candidateIds) {
  const plan = substitutionPlan[id];
  assert.ok(Array.isArray(plan.componentCoverage) && plan.componentCoverage.length, `${id} substitution plan needs componentCoverage.`);
  assert.ok(typeof plan.patternLater === "string" && plan.patternLater.trim(), `${id} substitution plan needs patternLater.`);
  assert.ok(typeof plan.decision === "string" && plan.decision.trim(), `${id} substitution plan needs decision.`);
  assert.ok(candidateCoverageStatuses.includes(plan.coverageStatus), `${id} substitution plan needs a valid coverageStatus.`);
  assert.ok(typeof plan.componentGap === "string" && plan.componentGap.trim(), `${id} substitution plan needs componentGap.`);
  assert.ok(typeof plan.nextDecision === "string" && plan.nextDecision.trim(), `${id} substitution plan needs nextDecision.`);
  const missingCoverage = plan.componentCoverage.filter((componentId) => !packageBackedSet.has(componentId));
  assert.deepEqual(missingCoverage, [], `${id} substitution coverage must use package-backed components: ${missingCoverage.join(", ")}`);

  const docsPlan = candidateCompositionPlans[id];
  assert.deepEqual(docsPlan.coverage, plan.componentCoverage, `${id} visible candidate docs must match backlog componentCoverage.`);
  assert.equal(docsPlan.assessment?.status, plan.coverageStatus, `${id} visible candidate docs must match backlog coverageStatus.`);
  assert.ok(typeof docsPlan.assessment?.gap === "string" && docsPlan.assessment.gap.trim(), `${id} visible candidate docs need an assessment gap.`);
  assert.ok(typeof docsPlan.assessment?.next === "string" && docsPlan.assessment.next.trim(), `${id} visible candidate docs need an assessment next decision.`);
  assert.ok(Array.isArray(docsPlan.examples) && docsPlan.examples.length, `${id} visible candidate docs need examples.`);
  const shownComponents = new Set(docsPlan.examples.flatMap((example) => example.components.map((component) => component.component)));
  const hiddenCoverage = plan.componentCoverage.filter((componentId) => !shownComponents.has(componentId));
  assert.deepEqual(hiddenCoverage, [], `${id} visible candidate docs must show every coverage component: ${hiddenCoverage.join(", ")}`);
  const missingLayout = [...shownComponents].filter((componentId) => !layoutFullWidth.includes(componentId) && !layoutNaturalWidth.includes(componentId));
  assert.deepEqual(missingLayout, [], `${id} visible candidate docs need width layout policy for: ${missingLayout.join(", ")}`);
}

console.log(JSON.stringify({
  status: "pass",
  catalogComponents: catalogComponentIds.length,
  packageBacked: packageBackedIds.length,
  candidateScopeDecisions: candidateIds.length,
  candidateCompositionDocs: docsPlanIds.length,
  implementationStatus: implementationStatusIds.length,
}, null, 2));

function assertNoDuplicates(label, values) {
  const seen = new Set();
  const duplicates = [];
  for (const value of values) {
    if (seen.has(value)) duplicates.push(value);
    seen.add(value);
  }
  assert.deepEqual(duplicates, [], `${label} must not include duplicates: ${duplicates.join(", ")}`);
}

function toCamel(id) {
  return id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function toPascal(id) {
  const camel = toCamel(id);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function extractCandidateLayoutComponents(css, declaration) {
  const blocks = [...css.matchAll(/\.candidate-composition \.docs-package-demo:is\(([\s\S]*?)\)\s*\{([\s\S]*?)\}/g)];
  const block = blocks.find((match) => match[2].includes(declaration));
  assert.ok(block, `Candidate layout CSS must include block for ${declaration}`);
  return [...block[1].matchAll(/\[data-doc-component="([^"]+)"\]/g)].map((match) => match[1]);
}
